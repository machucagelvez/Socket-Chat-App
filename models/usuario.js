const { Schema, model } = require('mongoose')


const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true //Evita que este campo esté repetido
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        //enum: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    //Este campo identifica si el usuario se registró con Google
    google: {
        type: Boolean,
        default: false
    }

})

// Se sobreescribe el método toJSON de Mongoose para sacar el password y la versión cuando se devuelven los datos del usuario:
// No se puede usar función de flecha porque se va a usar el objeto this
UsuarioSchema.methods.toJSON = function () {
    //toObject es un Método de Mongoose que convierte en un objeto de JS
    const { __v, password, _id, ...usuario } = this.toObject()
    //Se incluye el campo uid en usuario con lo que hay en _id (es para cambiar el nombre del campo al mostrarlo)
    usuario.uid = _id
    return usuario
}

//Al exportar 'Usuario' incica el nombre de la colección
//Mongoose le añade una 's' al nombre que se le dé
//En este caso la colección se llamará 'Usuarios'
module.exports = model('Usuario', UsuarioSchema)

