"use strict";
const gulp = require('gulp'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
nodemon = require('gulp-nodemon'),
browserify = require('gulp-browserify'),
handlebars = require('gulp-handlebars'),
wrap = require('gulp-wrap'),
declare = require('gulp-declare'),
htmlmin = require('htmlmin'),
browserSync = require('browser-sync').create();
var stream;

gulp.task('begin',function(){
  browserSync.init({
    // server: 'app.js',
    port: 3002,
     proxy: "127.0.0.1:3000"  // 代理到服务器
   });
   stream = nodemon({ script: 'app.js'
           , ext: 'html js'
           , ignore: ['ignored.js']});
   stream
       .on('restart', function () {
         console.log('restarted!');
        browserSync.reload();
       })
       .on('crash', function() {
         console.error('Application has crashed!\n')
          stream.emit('restart', 10);  // restart the server in 10 seconds
       })
       .on('start',function(){
         console.log('started!')
         //browserSync.reload();
       });

  gulp.watch(['./*.js','./controllers/*.js','./model/*.js','./common/*.js'],['nodemon']);
  gulp.watch(['./views/**/*.hbs','./views/*.hbs','./public/*.*','./public/**/*.*'],['nodemon']);
});
gulp.task('nodemon',function(){
  console.log(stream);
  stream.emit('restart');
});
