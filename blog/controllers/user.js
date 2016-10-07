/**
 * Created by tujunxiong on 2016/9/8.
 */
"use strict";

const User = require('../model/user');
const mail = require('../common/mailHelper');
const utile = require('utility');
const gm = require('gm');
const path = require('path');
const formidable = require('formidable')
const fs = require('fs-extra');
//控制层处理显示注册页面
exports.showRegister = function (req, res, next) {
   res.render('register');
};
//处理注册
exports.doRegister = function (req, res, next) {
   let username = req.body.username;
   let email = req.body.email;
   let password = req.body.password;
   let vcode = req.body.vcode;
   //判断验证码是否相同
   if (vcode != req.session.vcode) {
      return res.render('register', {msg: '验证码不正确!'})
   }
   //先做什么?  1:用户名和密码是否正的效验(是我的用户才判断是否激活)
   User.getUserInfoByName(username, function (err, result) {
      //获取到用户信息
      //1:用户名是存在
      if (err)next(err);
      if (result.length != 0) {
         return res.render('register', {msg: '用户名已经存在'})
      }
      let user_tmp = new User({
         username,
         password,
         email
      });
      user_tmp.save(function (err, result) {
         if (err)next(err);
         //放入邮件中发送给用户  127.0.0.1:3000/dasda
         let token = utile.md5(utile.md5(username));
         //邮箱激活
         mail.sendActiveMail(email, token, username);

         //您要到什么地方激活
         res.render('showNotice', {msg: `恭喜您,注册成功,激活账户邮件已经发送,请到${email}去激活该账号`});
      });
   });

   //3: 看看验证码是否一致(第一步)
};
exports.activeUser = function (req, res, next) {
   let username = req.query.username;
   let token = req.query.token;
   let souceToken = utile.md5(utile.md5(username));//以发送邮件前同样的算法加密用户
   if (token == souceToken) {
      //激活用户
      User.changeActiveFlag(username, function (err, result) {
         if (err)next(err);
         res.render('showNotice', {msg: '恭喜您激活成功!', info: '登录点这里', href: 'http://127.0.0.1:3000/login'});
      });
   } else {
      //用户随意输入,激活失败
      res.render('showNotice', {msg: '非法激活,无效!', href: 'http://127.0.0.1:3000/', info: '你点这里吧'});
   }
};
exports.showLogin = function (req, res, next) {
   res.render('login');
};
exports.doLogin = function (req, res, next) {
   let formUser = new User(req.body);
   //1:获取登录数据(查询数据库)
   User.getUserInfoByName(formUser.username, function (err, result) {
      //   * username password remember_me
      //2: 激活
      if (err)next(err);
      if (result.length == 0)//用户不存在
         return res.render('login', {msg: '用户名不存在!'});
      let user = result[0];
      if (!user.active_flag || user.active_flag == 0)//未激活
         return res.render('login', {msg: '用户并未激活,请查看邮件:' + user.email});
      //3:判断密码和是否一致
      if (user.password != formUser.password)
         return res.render('login', {msg: '密码错误!'});
      //3.5 : remember_me 0/1 记录到数据库中-->  如果查询出来的和选择的结果一致,不需要浪费查询一次
      console.log(user.remember_me, formUser.remember_me);
      if (user.remember_me != formUser.remember_me) {
         User.updateRememberFlag(formUser.remember_me || false, user.id, function (err, result) {
            if (err)next(err);
         });
      }
      req.session.user = user;
      //4: 密码正确,登录进去
      res.redirect('/');
   });
};
exports.doLogout = function (req, res, next) {
   req.session.user = null; //对于session挂载的用户属性滞空
   res.render('logout');
   ;//跳转到首页
};
exports.showSetting = function(req,res,next){
   res.render('setting',{user:req.session.user});
};
exports.uploadPic = function (req,res,next) {
   var form = new formidable.IncomingForm();
//表单写法:  enctype="multipart/form-data
   form.parse(req,function(err, fields, files) {
     let tmpPath = files.pic.path;//临时目录
     let fileName = files.pic.name;
     //生成缩略图
      let dist = req.app.locals.config.rootPath;
      dist = path.join(dist,'/public/upload/imgPic/'+(+new Date()),fileName);
      fs.move(tmpPath,dist,function(err){
         gm(dist)
            .resize(50, 50, '!')
            .write(dist, function (err) {
               if (!err) console.log('done');
            });
      });

   });
};