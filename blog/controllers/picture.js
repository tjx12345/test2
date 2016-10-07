/**
 * Created by tujunxiong on 2016/9/2.
 */
const picture = require('../model/picture.js');


exports.showPicture = function (req,res,next) {
   picture.getPicture('0123456789',5,function (err,obj) {
      req.session.vcode = obj.text;//制作完图片,会返回一个对象,对象中存在着二进制以及文本数据的答案
      res.send('aaa');
   });
};
