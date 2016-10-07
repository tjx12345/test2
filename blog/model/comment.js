/**
 * Created by tujunxiong on 2016/9/10.
 */
const db = require('./db');
function Comment(comment) {
   this.id = comment.id;
   this.content = comment.content;
   this.aid = comment.aid;
   this.uid = comment.uid;
   this.time = comment.time;
}

Comment.getCommentsAndUserByAid = function (aid,callback) {
   db.query(`SELECT
	t1.aid,
	t1.content,
	t1.id AS cid,
	t2.*
FROM
	comments t1
LEFT JOIN users t2 ON t1.uid = t2.id
WHERE
	t1.aid = ?`,[aid],callback);
};

Comment.prototype.save = function(callback){
  db.query(`insert into comments (content,time,uid,aid) 
  values (?,now(),?,?)`,[this.content,this.uid,this.aid],callback) ;
};
module.exports = Comment;