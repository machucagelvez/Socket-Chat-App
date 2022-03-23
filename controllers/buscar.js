const { response } = require('express')
const { isValidObjectId } = require('mongoose')

const { Usuario, Categoria, Producto } = require('../models')

const coleccinesPermitidas = [
  'categorias',
  'productos',
  'usuarios',
  'roles',
]

const buscarUsuarios = async (termino = '', res = response) => {
  const esMongoId = isValidObjectId(termino)
  if (esMongoId) {
    const usuario = await Usuario.findById(termino)
    return res.json({
      results: usuario ? [usuario] : [],
    })
  }

  const regex = new RegExp(termino, 'i') //Hace que termino sea insensible a mayúsculas
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }], //Incluye varios criterios de búsqueda, en este caso con 'or'
    $and: [{ estado: true }],
  })
  res.json({
    results: usuarios,
  })
}

const buscarCategorias = async (termino = '', res = response) => {
  const esMongoId = isValidObjectId(termino)
  if (esMongoId) {
    const categoria = await Categoria.findById(termino)
    return res.json({
      results: categoria ? [categoria] : [],
    })
  }

  const regex = new RegExp(termino, 'i')
  const categorias = await Categoria.find({
    nombre: regex,
    estado: true, //busca por nombre y estado
  })
  res.json({
    results: categorias,
  })
}

const buscarProductos = async (termino = '', res = response) => {
  const esMongoId = isValidObjectId(termino)
  if (esMongoId) {
    const producto = await Producto.findById(termino).populate(
      'categoria',
      'nombre',
    )
    return res.json({
      results: producto ? [producto] : [],
    })
  }

  const regex = new RegExp(termino, 'i')
  const productos = await Producto.find({
    $or: [{ nombre: regex }, { descripcion: regex }],
    $and: [{ estado: true }, { disponible: true }],
  }).populate('categoria', 'nombre')
  res.json({
    results: productos,
  })
}

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params

  if (!coleccinesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccinesPermitidas}`,
    })
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res)
      break

    case 'categorias':
      buscarCategorias(termino, res)
      break

    case 'productos':
      buscarProductos(termino, res)
      break

    default:
      res.status(500).json({
        msg: 'Se le olvidó hacer esta búsqueda',
      })
  }
}

module.exports = {
  buscar,
}
