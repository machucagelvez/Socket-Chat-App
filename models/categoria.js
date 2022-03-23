const { Schema, model, SchemaTypes } = require('mongoose')

const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario', //Hace referencia al modelo Usuario con el que está relacionado
    required: true,
  },
})

CategoriaSchema.methods.toJSON = function () {
  //toObject es un Método de Mongoose que convierte en un objeto de JS
  const { __v, estado, ...categoria } = this.toObject()
  return categoria
}

module.exports = model('Categoria', CategoriaSchema)
