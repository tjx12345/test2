var app = require('express')(),
  server  = require("http").createServer(app),
  io = require("socket.io")(server),
  session = require("express-session")({
    key:'connect_sid',
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
  }),
  sharedsession = require("express-socket.io-session");


// Attach session
app.use(session);
app.get('/',function(req,res,next){
  req.session.active = null;
  res.sendFile(__dirname + '/index.html');
});
app.get('/aaa',function(req,res){
  console.log(req.session);
  console.log(io.sockets);

  res.end('aa');
  io.sockets.sockets[req.session.socketid].emit('myMsg','tujunxiong');
});
// Share session with io sockets
sharedsession = require("express-socket.io-session");
io.use(sharedsession(session));

io.on("connection", function(socket) {
        console.log('1:',  socket.handshake.session);
        socket.handshake.session.socketid = socket.id;
        socket.handshake.session.save();
        console.log('c:'+socket.id);

});
io.on("disconnection", function(socket) {
        console.log('d:1:',  socket.handshake.session);
        socket.handshake.session.socketid = socket.id;
        socket.handshake.session.save();
        console.log('dc:'+socket.id);

});

server.listen(3000);
