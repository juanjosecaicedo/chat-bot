const express = require("express");
const { emit } = require("process");
const app = express();
const http = require("http").Server(app);
var io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get('/:tel', (req, res) => {
  var ms = chats.filter(item => item.data.telefono === req.params.tel);
  res.json(ms);
})

var chats = [];
io.on('connection', function(socket){
  socket.emit('welcome-messaje', '¿Hola en que te podemos ayudar? comunicate con nosostros');
  socket.on('chat-contact', function(data) {
    socket.broadcast.emit('user-list-in-chat', data);
    socket.emit('chat-contact', {msg: '!Hola ✋ '+ data.nombre +' en un momento un asesor se comunicara contigo via telefonica!', user: 'bot'});
    socket.on('chat-'+data.telefono, function(data_) {
      chats.push(data_)
      socket.emit('chat-'+data.telefono, data_);
    })
  })
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('user-list-in-chat', function(data){
    socket.emit('user-list-in-chat', data);
  });

});

http.listen(port, () => {
  console.log("server on port: http://localhost:"+port);
});
