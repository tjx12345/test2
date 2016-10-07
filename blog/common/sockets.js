const sio = require('socket.io');
// const cookieParser = require('cookie-parser');
const cookie = require('cookie');
var isOk = false;

function Sockets(app, http) {
    //http代表着socket.io -> express-> 服务器实例
    var io = sio.listen(http);
    var sessionStore = app.get('sessionStore');
    io.use(function(socket, next) {
        if (socket.request.headers.cookie) {
            var cookies = cookie.parse(socket.request.headers.cookie),
                sid = cookies['connect.sid'];
            //sid是s:aX18zDG0ZhZUrq2sJL4YQ6FYO2m1d1B2.sjdnbT7xypmBZQg6UbkZ+Dz493jBxKJUFOtjyZYIqq0
            //在sessionStore构造的时候传入了transformId 来修正其值为aX18zDG0ZhZUrq2sJL4YQ6FYO2m1d1B2 获取session
            console.log('cookies:',cookies);
            sessionStore.get(sid, function(err, session) {
                console.log('找到session',sid);
                if (err || !session) {
                    return next('无法查询到session');
                }

                if(session.user &&　session.user.id){//将用户名作为key挂载到io的socket队列上
                  io.sockets.sockets[session.user.id] = socket.id;
                  console.log('socket :24:io.sockets.sockets',io.sockets.sockets);
                  return next();
                }
            });
        } else {
            return next('验证时无cookie');
        }
    });
    io.on('connection', function(socket) {

        console.log('conn', ':连进来了,socketid:'+socket.id);
    });
    io.on('disconnection', function(socket) {
        console.log('conn' + socket.id);
    });
    io.on('chat message', function(msg) {
        console.log('caht' + msg);
    });
    Sockets.prototype.io = io;
    Sockets.io = io;


}
module.exports = Sockets;
