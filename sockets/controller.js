const socketController = (socket) => {
  console.log('Un usuario se ha conectado', socket.id)
}

module.exports = {
  socketController,
}
