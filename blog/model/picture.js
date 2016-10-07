"use strict";

exports.getPicture = function (content, length, callback) {
   const captchapng = require('captchapng');
   var randomcode = '';
   let returnObj = {};
   for (var i = 0; i < length; i++) {
      randomcode += content[parseInt(Math.random() * 1000) % content.length];
   }

   returnObj.text = randomcode;//1462  5582  5551
//输出图片
   var p = new captchapng(80, 30, parseInt(randomcode)); // width,height,numeric captcha
   p.color(255, 255, 255, 0);  // First color: background (red, green, blue, alpha)
   p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
   var img = p.getBase64();
   returnObj.buf = new Buffer(img, 'base64')
   callback(null, returnObj);


};
