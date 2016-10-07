/**
 * Created by tujunxiong on 2016/9/9.
 */
"use strict";
const db = require('./db');
function Article(article) {
   this.id = article.aid;
   this.title = article.title;
   this.content = article.content;
   this.time = article.time;
   this.uid = article.uid;//用户id
   this.answerCount = article.answerCount;
}

Article.getArticlesByLimit = function (offset, count, callback) {
   db.query(`select t1.id as aid,t1.answerCount,t1.content,t1.time,
  t1.title,t2.* from articles t1 
  left join users t2 on t1.uid = t2.id 
  order by t1.time limit ?,?`, [offset, count], callback);
};
Article.getTotalPage = function (callback) {
   db.query('select count(*) as total from articles ', [], callback);
};
Article.searchArticles = function (q, offset, count, callback) {
   // 'select * from articles like %aaa%'
   db.query(`SELECT
   t1.id AS aid,
   t1.title,
   t1.content,
   t1.time,
   t1.uid,
   t2.*
   FROM
   articles t1
   LEFT JOIN users t2 ON t1.uid = t2.id  where title like ? 
   order by t1.time desc limit ?,?`, ['%' + q + '%', offset, count], callback);
};
Article.getTotalPageByCondition = function (q, callback) {
   db.query('select count(*) as total from articles where title like ? ', ['%' + q + '%'], callback);
}
Article.prototype.save = function (callback) {
   db.query('insert into articles (title,content,time,uid,answercount) values (?,?,now(),?,0)', [this.title, this.content, this.uid], callback);
};
Article.getArticleById = function (aid, callback) {
   db.query(`select t1.id as aid,t1.answerCount,t1.content,t1.time,
  t1.title,t2.* from articles t1 
  left join users t2 on t1.uid = t2.id where t1.id = ?`, [aid], callback);
};
Article.updateArticle = function(aid,title,content,callback){
   db.query('update articles set title = ? ,content = ? where id = ?',[title,content,aid],callback);
}
module.exports = Article;