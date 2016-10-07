/**
 * Created by tujunxiong on 2016/9/9.
 */
"use strict";
const path = require('path');
const formidable = require('formidable');
const fs = require('fs-extra');
const timeAgo = require('node-time-ago');
const Article = require('../model/article');
const Page = require('../model/page');
const User = require('../model/user');
const comment = require('../controllers/comment');
const utile = require('utility');
const sequenceTask = require('../common/sequenceTask.js');
const Promise = require('bluebird');
const async = require('async');



exports.showArticles = function(req, res, next) {
    let currentPage = req.query.current || 1;
    let totalPage;
    let viewPage = req.app.locals.config.viewPage;
    let offset = (currentPage - 1) * viewPage;
    let count = viewPage;
    let pager;
    //  //一共多少页//select count(*) from articles

  //  getTotalPageAsync = Promise.promisify(getTotalPageAsync);
  //  getArticlesByLimitAsync= Promise.promisify(getArticlesByLimitAsync);
  //  getTotalPageAsync()
  //  .then(getArticlesByLimitAsync);
        // .catch(function (err) {
        //    next(err);
        // });
        //嵌套方式
        // Article.getTotalPage(function (err, result) {
        //    totalPage = result[0].total / viewPage;//62
        //    var pager = new Page({currentPage:currentPage||1, totalPage:totalPage||5, viewPage});
        //    Article.getArticlesByLimit(offset, count, function (err, articles) {
        //           console.log('article:33,准备渲染');
        //           res.render('index', {articles, pager, user: req.session.user});
        //   });
        // });
  //  sequenceTask([getTotalPageAsync,getArticlesByLimitAsync]);
    // Promise.reduce([getTotalPageAsync,getArticlesByLimitAsync],function (arg, task) {
    //         return runTask(task, arg);
    //     }, args);
    // });
     async.series([function(callback){
       Article.getTotalPage(function(err, result) {
           totalPage = result[0].total / viewPage; //62
           pager = new Page({
               currentPage: currentPage || 1,
               totalPage: totalPage || 5,
               viewPage
           });
           callback(err,1);
       });
     },function(callback){
       Article.getArticlesByLimit(offset, count, function(err, articles) {
             res.render('index', {
                 articles,
                 pager,
                 user: req.session.user
             });
             callback(err,2);
         });
     }],function(err,result){
        if(err)next(err);
          console.log(result);
     });


    //显示文章
    //一页显示多少条
    //显示哪些

};

exports.getArticleByName = function(req, res, next) {
    let searchQuery;
    if (req.method == 'POST') { //在模糊查询的业务逻辑中,只会有先查询post,后查询get
        searchQuery = req.body.q; //模糊查询字段值  拿的是请求体的字段
        req.app.locals.q = searchQuery;
    } else { //get请求
        searchQuery = req.app.locals.q; //第一次模糊查询以后就有可能是get请求了
    }

    //req.param.aaa 拿的是 127.0.0.1/aaa 得到的是aaa
    //req.query.a 拿的是 127.0.0.1/aaa? a=1    那到的是a=1
    // 'select * from articles where title like '%qq%''
    Article.getTotalPageByCondition(searchQuery, function(err, result) {
        let viewPage = req.app.locals.config.viewPage;
        let totalPage = result[0].total / viewPage;
        //分页查询 0,5  4,5
        let currentPage = req.query.current || 1;
        let offset = (currentPage - 1) * viewPage;
        let count = viewPage;
        totalPage = Math.ceil(totalPage);
        let pager = new Page({
            currentPage: currentPage,
            viewPage,
            totalPage
        });

        Article.searchArticles(searchQuery, offset, count, function(err, articles) {
            pager.url = '/getArticleByName';
            //let objs = getBeans(articles);
            res.render('index', {
                articles,
                pager
            });
        });
    });
}
exports.showPublish = function(req, res, next) {
    res.render('publish', {
        user: req.session.user
    });
};
exports.doPublish = function(req, res, next) {
    let article = new Article(req.body);
    article.uid = req.session.user.id;
    article.save(function(err, result) {
        res.redirect('/showArticle?aid=' + result.insertId); //对于插入操作会返回一个插入主键id
    });

};
//控制文件上传 formidable
exports.doUpload = function(req, res, next) {
    var form = new formidable.IncomingForm();
    //表单写法:  enctype="multipart/form-data
    form.parse(req, function(err, fields, files) {
        //移动文件
        let file = files.pic; //系统临时文件对象
        let sourcePath = file.path; //系统临时文件路径
        //(+new Date() 为了保证目录不重名,文件不被覆盖
        const tempPath = path.join('/public', '/upload', '/img', '/' + (+new Date()), file.name);
        let distPath = path.join(req.app.locals.config.rootPath, tempPath);
        //原生fs不能跨目录移动,不能自动创建移动中的文件夹
        fs.move(sourcePath, distPath, function(err) {
            if (err) next(err);
            res.json({
                msg: tempPath
            }); //前端接受到路径,加入到img的src
            //tempPath:\upload\img\1473472667257\1.jpg
        });
    });
};
exports.showArticle = function(req, res, next) {
    //将令牌保存到session中
    req.session.token = utile.md5(+(new Date()) + '');
    let post_hash = req.session.token; //此时两个都是相等的
    //获取查询条件
    const aid = req.query.aid;
    //查询数据
    Article.getArticleById(aid, function(err, result) {
        if (err) next(err);
        let obj = getBeans(result);
        let user = obj.users[0];
        let article = obj.articles[0];
        article.showTime = timeAgo(article.time);
        comment.getCommentsAndUserByAid(article.id, function(err, comments) {
            if (err) next(err);
            article.post_hash = post_hash;
            return res.render('article', {
                article,
                comments,
                user
            });
        });

    });

    //用对象渲染模板
};
exports.showEdit = function(req, res, next) {
    let aid = req.params.aid;
    Article.getArticleById(aid, function(err, result) {
        if (err) next(err); //article
        res.render('edit', {
            article: result[0]
        });
    });
};
exports.editArticle = function(req, res, next) {
    let aid = req.params.aid;
    let content = req.body.content;
    let title = req.body.title;
    Article.updateArticle(aid, title, content, function(err, result) {
        if (err) next(err);
        return res.redirect('/showArticle?aid=' + aid);

    });
};

function getBeans(objs) {
    let users = [];
    let articles = [];
    for (var i = 0; i < objs.length; i++) { //多表查询的结果,该对象是数组,每个元素是user和文章的结合
        var obj = objs[i]; //解析混合体
        users.push(new User(obj));
        articles.push(new Article(obj));
    }
    return {
        users,
        articles
    };
}
