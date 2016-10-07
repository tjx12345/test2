/**
 * Created by tujunxiong on 2016/9/8.
 */
const express = require('express');
const indexController = require('./controllers/index');
const userController = require('./controllers/user');
const picController = require('./controllers/picture');
const articleController = require('./controllers/article');
const commentController = require('./controllers/comment');
const web_router = express.Router();
module.exports = function(app){
  web_router.get('/',articleController.showArticles);
  web_router.get('/getArticles',articleController.showArticles);//没有user
  web_router.get('/register',userController.showRegister);//req,res,next  )
  web_router.post('/register',userController.doRegister);
  web_router.get('/active',userController.activeUser);
  web_router.get('/login',userController.showLogin);
  web_router.post('/login',userController.doLogin);//登录没有articles
  web_router.get('/logout',userController.doLogout);
  web_router.get('/getPicture',picController.showPicture);
  web_router.post('/getArticleByName',articleController.getArticleByName);
  web_router.get('/getArticleByName',articleController.getArticleByName);
  web_router.get('/publishArticle',articleController.showPublish);
  web_router.post('/publish/article',articleController.doPublish);
  web_router.post('/article/upload',articleController.doUpload);
  web_router.get('/showArticle',articleController.showArticle);
  web_router.post('/comment/post/:aid',commentController.saveComment);
  web_router.get('/edit/article/:aid',articleController.showEdit);
  web_router.post('/edit/article/:aid',articleController.editArticle);
  web_router.get('/setting/profile/:uid',userController.showSetting);
  web_router.post('/setting/upload',userController.uploadPic);
  app.use(web_router);
};
