/**
 * Created by tujunxiong on 2016/9/8.
 */
const db = require('./db');
function User(user) {
   this.id = user.id;
   this.username = user.username;
   this.password = user.password;
   this.email = user.email;
   this.active_flag = user.active_flag;
   this.remember_me = user.remember_me;
   this.pic = user.pic;
}
User.getUserInfoByName = function (name, callback) {//12345678
   db.query('select * from users where username = ?', [name], callback);
}
User.prototype.save = function (callback) {
   db.query('insert into users (username,password,email,active_flag,remember_me,pic) values (?,?,?,?,?,?)', [this.username, this.password, this.email, this.active_flag, this.remember_me, this.pic], callback);
};
User.changeActiveFlag = function (uname, callback) {
   db.query('update users set active_flag = true where username = ?', [uname], callback);
};
User.updateRememberFlag = function (flag, uid, callback) {
   db.query('update users set remember_me = ? where id = ?', [flag, uid], callback);
};
module.exports = User;