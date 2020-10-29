
const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("server on port http://localhost:" + port);
});
var numUsuarios = 0;
app.use(express.static(path.join(__dirname, "public")));
io.on('connection', (socket) => {
  //cuando el cliente emite 'nuevo mensaje', este escucha y ejecuta
  socket.on('nuevo mensaje', (data) => {
    socket.broadcast.emit('nuevo mensaje', data);
  });
  
  //cuando el cliente emite 'agregar usuario', este escucha y ejecuta
  socket.on('nuevo usuario', (usuario) => {
    //almacenamos el nombre de usuario en la sesión de socket para este cliente
    socket.username = usuario;
    ++numUsuarios;
    socket.emit('iniciar sesion', {
      numUsuarios: numUsuarios
    });
    //Repetir globalmente (todos los clientes) que una persona ha conectado
    socket.broadcast.emit('usuario unido', {
      nombreusuario: socket.username,
      numUsuarios: numUsuarios
    });
  });

  //cuando el cliente emite 'esta scribiendo typing', lo transmitimos a otros
  socket.on('escribiendo', ()=> {
    socket.broadcast.emit('escribiendo', {
      nombreusuario: socket.username
    });
  });

  //cuando el cliente emite 'dejar de escribir', lo transmitimos a otros
  socket.on('dejar de escribir', () => {
    socket.broadcast.emit('dejar de escribir', {
      nombreusuario: socket.username
    });
  });

  //Cuando la usuaria se desconecte .. realiza esto
  socket.on('disconnet', () => {
    --numUsuarios;
    //repito globalmente que este cliente se ha ido
    socket.broadcast.emit('el usuario se fue', {
      nombreusuario: socket.username,
      numUsuarios: numUsuarios
    })
  })

});
