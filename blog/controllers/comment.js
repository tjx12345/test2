/**
 * Created by tujunxiong on 2016/9/10.
 */
"use strict";

const Comment = require('../model/comment');
const sio = require('../common/sockets.js');



exports.saveComment = function(req,res,next){
   let content = req.body.content;
   let aid = req.body.article_id;
   let uid = req.session.user.id;
   let to_id = req.body.to_id;//作者id
   let comment = new Comment({
      aid,uid,content
   });
   sleep(2000);//模拟网速较慢,产生的客户端多次点击提交事件

   //处理token令牌
   //1:拿到浏览器的token
   let postHash = req.body.post_hash;
   //2:获取session的token
   let serveHash = req.session.token;
   //3: 判断
   if(checkToken(postHash,serveHash)){
      //如果token相等,继续后续执行,将token销毁
      req.session.token = null;
      //1:nodejs中有一个叫做session store 存贮session数据
      //2:上次保存于该次修改的数据间隔时间小于60秒,认为数据修改无效
      req.session.save();
   }else{
      return res.render('showNotice',{msg:'请勿多次提交,若网慢,请升级宽带',href:'/',info:'跳转首页'});
   }

   //如果不相等,跳转到showNotice页面,请勿多次提交,若网慢,请升级宽带

   comment.save(function(err,result){
      if(err)next(err);
      //通知对应用户给予提示
    let socketId =   sio.io.sockets.sockets[to_id];
    if(socketId)
      sio.io.sockets.sockets[socketId].emit('myMsg','大家好,我来啦');
    res.redirect('/showArticle?aid='+aid);
   });
};
exports.getCommentsAndUserByAid = function (aid,callback) {
   Comment.getCommentsAndUserByAid(aid,callback);
};
//模拟睡眠
function sleep(m) {
   for (var start = +new Date();+new Date()-start <= m ;) {}
}
function checkToken(t1,t2){
   if(t1 == null) return false;  //通过非评论页面模仿的请求,必然没有token
   if(t2 == null) return false;  //服务器没有token,如果该轮请求已经完成,后续还有来的请求
   if(t1 != t2) return false;    //为了程序的健壮性
   return true;      //如果都不满足,此时就认为是合理的请求
}
