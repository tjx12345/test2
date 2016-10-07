var mongoose = require('mongoose');
require('./userModel.js')
var Schema = mongoose.Schema;
//2:建立连接
mongoose.connect('mongodb://127.0.0.1/node_club_dev');
// var User_Tmp = new Schema({
//   content:{type:String},
//   username : {type:String},
//   age:{type:Number}
// });
//创建集合
var User = mongoose.model('User_Tmp');
var kitty = new User({username:'唐家凉'});
// //
// // kitty.talk = function(){
// //   console.log('dajiahao');
// // }
console.log(kitty.update_at_ago());
console.log(kitty.fullname);
kitty.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('meow');
  }
});
User.findOne({username:'test1'},function(err,user){
  console.log(user);
});
