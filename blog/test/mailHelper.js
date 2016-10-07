/**
 * Created by tujunxiong on 2016/9/1.
 */
"use strict";

var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var fs = require('fs');



module.exports.sendActiveMail  = function(address,token,username){
// 开启一个 SMTP 连接池
   var transport = nodemailer.createTransport(smtpTransport({
      host: "smtp.qq.com", // 主机
      secure: true, // 使用 SSL
      port: 465, // SMTP 端口
      auth: {
         user: "tjx1_1@qq.com", // 账号
         pass: "huozsgjqtiqgbhfd" // 密码
      }
   }));
// 设置邮件内容

   var mailOptions = {
      from: "tjx1_1@qq.com", // 发件地址
      to: address, // 收件列表
      subject: "itcast博客激活邮件", // 标题
      // html: "<b>thanks a for visiting!</b>"
   }

mailOptions.attachments = [{filename:'xtt.jpg',content:fs.readFileSync('./xtt.jpg')}];
//    mailOptions.text = `username感谢您注册本博客网站,
//    请点击该链接:/active?username=
//    进行激活,O(∩_∩)O谢谢`
// 发送邮件

   transport.sendMail(mailOptions, function(error, response) {
      if (error) {
         console.error(error);
      } else {
         console.log('发送邮件成功');
      }

      transport.close(); // 如果没用，关闭连接池
   });};