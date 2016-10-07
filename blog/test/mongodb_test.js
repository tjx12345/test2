//1:引入mongoose
var mongoose = require('mongoose');
//声明一个图表schema
var User = require('./userModel.js')
console.log('1:',User);
 User = mongoose.model('User_Tmp');
 console.log('2:',User);
var user = new User({name:'张三',age:1})
//编译该对象

//2:建立连接
mongoose.connect('mongodb://127.0.0.1/node_club_dev');


// var myUser = new User({name:'aaa',age:12});
// User.find(function (err,users) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(users);
//   }
// });

//3:查询数据
User.count({ name: 'name' }, function (err, count) {

  console.log('there are %d jungle adventures', count);
});
