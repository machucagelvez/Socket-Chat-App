class Mensaje {
  constructor(uid, nombre, mensaje) {
    this.uid = uid
    this.nombre = nombre
    this.mensaje = mensaje
  }
}

class ChatMensajes {
  constructor() {
    this.mensajes = []
    this.usuarios = {}
  }

  get ultimos10() {
    this.mensajes = this.mensajes.splice(0, 10)
    return this.mensajes
  }

  get usuariosArr() {
    return Object.values(this.usuarios) //devuelve un array con los valores de los objetos
  }

  enviarMensaje(uid, nombre, mensaje) {
    //Crear un nuevo mensaje
    this.mensajes.unshift(
      //unshift() agrega uno o más elementos al inicio del array, y devuelve la nueva longitud del array
      new Mensaje(uid, nombre, mensaje),
    )
  }

  conectarUsuario(usuario) {
    this.usuarios[usuario.id] = usuario
  }

  desconectarUsuario(id) {
    delete this.usuarios[id]
  }
}

module.exports = ChatMensajes
