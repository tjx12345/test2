var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User_Tmp = new Schema({
  content:{type:String},
  username : {type:String},
  age:{type:Number},
});
User_Tmp.plugin(require('./plug1.js'))
// var UserA = {name:''}
// var talk = function(schema){
//   schema.talk = function(){
//     console.log('大家好');
//   }
// }
// User_Tmp.plugin(talk);
var virtual = User_Tmp.virtual('fullname');
virtual.get(function () {
  return  ' 中国人' + this.username;
});
mongoose.model('User_Tmp',User_Tmp);
