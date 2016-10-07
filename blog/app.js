/**
 * Created by tujunxiong on 2016/9/8.
 */
"use strict";
//express单独构建
//将express构建的应用实例交给http来管理http
//获得到管理http的app对象
//交给socket.io来管理
const express = require('express');
const cookiesParser = require('cookie-parser');
const exphbs = require('express3-handlebars');
const bodyParser = require('body-parser');
const config = require('./config');
const session = require('express-session');
var app = express();//构建服务器
const http = require('http').createServer(app);
const sio = require('socket.io');
var MongoStore = require('connect-mongo')(session);
// , ioSession = require('socket.io-session');
var memoryStore = new MongoStore({
  db: 'node_club_dev',
  url: 'mongodb://localhost/node_club_dev',
  transformId:function(str){
    if(str){
      if(str.split('.').length > 1){
        return str.split('.')[0].split(':')[1]
      }
      return str
    }
    return null;
  } ,
});
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
  // key:'connect_sid',
   store:memoryStore,
   cookie: {
      expires: new Date(Date.now() + 1000 * 60 * 10) //以毫秒值为单位
   }
}));
//解析cookie
app.use(cookiesParser());
//整合socket io 的session
//app.use(require("express-socket.io-session")(express));
app.set('sessionStore',memoryStore);
app.use(function(req, res, next){
  req.session.active = null;//创建session
  next();
});
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
    //  req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 10);
      req.resetMaxAge();
      req.session.save();
      return res.render('non_session');//3秒以后跳转到首页
   }
   next();
});

app.use(function (req, res, next) {
   //删除session,需要删除session内部的cookie
   req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 10);
   next();
});


// var SessionSockets = require('session.socket.io')
//   , sessionSockets = new SessionSockets(sio, memoryStore, cookiesParser);
// sessionSockets.on('connection', function (err, socket, session) {
//     console.log('+++',socket);
//     console.log('+++',session);
//   });
//添加路由中间件
require('./web_router')(app);
//使用万能中间件,404找不到页面
app.all('*', function (req, res, next) {//对于所有的请求方式 * 代表在127.0.0.1/后面加的任意字符串
   res.render('404');
});
http.listen(config.port);
//通过socket.io 来构造服务器
require('./common/sockets.js')(app,http);

process.on('uncaughtException', function(err){
  console.log('未预期的异常' + err.stack);
});
//模拟睡眠
function sleep(m) {
   for (var start = +new Date();+new Date()-start <= m ;) {}
}
