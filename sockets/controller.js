const { comprobarJWT } = require('../helpers/generar-jwt')
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes()

const socketController = async (socket, io) => {
  const usuario = await comprobarJWT(
    socket.handshake.headers['x-token'],
  )
  if (!usuario) {
    return socket.disconnect()
  }

  //Agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario)
  io.emit('usuarios-activos', chatMensajes.usuariosArr) //io.emit() envia un evento a todos los sockets conectados. Con socket tendría que hacer un .emit y un .broadcast.emit
  socket.emit('recibir-mensajes', chatMensajes.ultimos10) //Envía los últimos 10  mensajes al usuario que se conecta

  //Conectar al usuario a una sala específica
  socket.join(usuario.id)
  //Al final hay tres salas: general (la controla io), privada y usuario (la controla el socket)

  //Limpiar cuando se desconecta el usuario
  socket.on('disconnect', () => {
    chatMensajes.desconectarUsuario(usuario.id)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
  })

  socket.on('enviar-mensaje', ({ uid, mensaje }) => {
    if (uid) {
      //Mensaje privado
      socket
        .to(uid)
        .emit('mensaje-privado', { de: usuario.nombre, mensaje })
    } else {
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)
      io.emit('recibir-mensajes', chatMensajes.ultimos10)
    }
  })
}

module.exports = {
  socketController,
}
