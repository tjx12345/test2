/**
 * Created by tujunxiong on 2016/9/8.
 */
"use strict";
const mysql = require('mysql');
const config = require('../config');


// db.query('select * from users where id = ? and name =? ',function(err,result){
//
// });




module.exports.query = function(sql, p, c) {
    let callback;
    let params = [];
    if (arguments.length === 3 && typeof c == 'function' && p instanceof Array) {
        callback = c;
        params = p;
    } else if (arguments.length === 2 && typeof p == 'function') {
        callback = p;
    } else {
        console.log('------------', sql, p, c);
        throw new Error('使用参数不正确,请查看db.js');
    }
    //创建数据库连接池来管理数据库连接
    const pool = mysql.createPool({
        user: config.dbname,
        password: config.dbpsw,
        connectionLimit: 30,
        host: config.host,
        database: config.database
    });
    //获取一个连接
    pool.getConnection(function(err, connection) {
        connection.query(sql, params, function(err, result) {
            //  console.log(sql,params);
            connection.commit(); //提交数据
            connection.release(); //释放资源
            if (err) callback(err, null);
            callback(null, result);
        });

    });


}
