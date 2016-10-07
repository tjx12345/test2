/**
 * Created by tujunxiong on 2016/9/8.
 */
"use strict";

const express = require('express');
const web_router = require('./web_router');
const exphbs = require('express3-handlebars');
const bodyParser = require('body-parser');
const config = require('./config');
const session = require('express-session');
var app = express();//构建服务器
//设置handlebars对象的基本设置
app.engine('.hbs', exphbs({
   extname: '.hbs',
   defaultLayout: 'layout',
   partialsDir: 'views/partials'  //该路径不意味着当前的盘符相对路径
}));
app.set('view engine', '.hbs');//设置express 模板渲染引擎
app.set('views', './views')//设置模板读取的目录
app.use('/public', express.static('public'));//127.0.0.1:3000/css/img/bg.gif
app.use(bodyParser.urlencoded({extended: false}));//在中间件环节加入解析body体
//在中间件环节中加入session
app.use(session({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: false,
   unset : 'destroy',
   cookie: {
      expires: new Date(Date.now() + 1000 * 60 * 10) //以毫秒值为单位
   }
}));

//挂载本地变量config
app.use(function (req, res, next) {
   app.locals.config = config;
   next();
});
//错误处理中间件
app.use(function (err, req, res, next) {
   console.log('出现异常', err.stack);
   next();
});
//加入session失效驱逐功能
app.use(function (req, res, next) {
   //originalMaxAge:session存活时间计时 默认是正数,慢慢减去,小于0就是失效
   if (req.session.cookie.originalMaxAge < 0) {//如果长时间未操作,再来操作
      //将用户赶走,并提示
      //将session事件恢复以便后续操作跳转首页
      req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 10);
      return res.render('non_session');//3秒以后跳转到首页
   }
   next();
});
app.use(function (req, res, next) {
   //删除session,需要删除session内部的cookie
   req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 10);
   next();
});
app.use('/comment/post/:aid',function (req,res,next) {

   sleep(2000);
   var serveToken = req.session.token;
   let post_hash = req.body.post_hash;//拿到浏览器隐藏域token
   console.log(post_hash);
   console.log(req.session.token);

   if(checkToken(serveToken,post_hash)) {
      console.log('bbb');
      req.session.token = null;
      req.session.token = null;
      req.session.save();
      serveToken = null;
   }else{
      console.log('aaa');

      return res.render('showNotice',{msg:'请勿重复刷新!',href:'/',info:'请点击'});
   }
});
//添加路由中间件
app.use(web_router);
//使用万能中间件,404找不到页面
app.all('*', function (req, res, next) {//对于所有的请求方式 * 代表在127.0.0.1/后面加的任意字符串
   res.render('404');
});


app.listen(config.port);

//模拟睡眠
function sleep(m) {
   for (var start = +new Date();+new Date()-start <= m ;) {}
}
//检查令牌是否一致
function checkToken(t1,t2){//692cf0b5e9446eaf74699ce788f03853
   if(t1==null)return false;//客户端没有令牌
   if(t2==null)return  false;//服务器请求已经完结,令牌删除
   if(t1!=t2)return  false;//客户端伪造令牌
   return true;
}
