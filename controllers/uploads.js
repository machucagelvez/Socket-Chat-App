const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require('express')
const { subirArchivo } = require('../helpers/subir-archivo')

const { Usuario, Producto } = require('../models')

const cargarArchivo = async (req, res = response) => {
  try {
    //Archivos de texto, carpeta 'textos':
    // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos')

    //Archivos por defecto ('png', 'jpg', 'jpeg', 'gif'), los que están en subir-archivos.js.
    //El undefined es para poder enviar al tercer argumento
    const nombre = await subirArchivo(req.files, undefined, 'img')
    res.json({ nombre })
  } catch (msg) {
    res.status(400).json({ msg })
  }
}

const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params
  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        })
      }
      break

    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        })
      }
      break

    default:
      return res.status(500).json({ msg: 'No se validó' })
  }

  //Limpiar imágenes previas
  if (modelo.img) {
    const pathImagen = path.join(
      __dirname,
      '../uploads',
      coleccion,
      modelo.img,
    )
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen)
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion)
  modelo.img = nombre
  await modelo.save()
  res.json({ modelo })
}

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params
  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        })
      }
      break

    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        })
      }
      break

    default:
      return res.status(500).json({ msg: 'No se validó' })
  }

  //Limpiar imágenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split('/')
    const nombre = nombreArr[nombreArr.length - 1]
    const [public_id] = nombre.split('.')
    cloudinary.uploader.destroy(public_id)
  }

  const { tempFilePath } = req.files.archivo //Es la ubicación temporal del archivo que se carga
  const { secure_url } = await cloudinary.uploader.upload(
    tempFilePath,
  )
  modelo.img = secure_url
  await modelo.save()
  res.json(modelo)
}

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params
  let modelo

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        })
      }
      break

    case 'productos':
      modelo = await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        })
      }
      break

    default:
      return res.status(500).json({ msg: 'No se validó' })
  }

  if (modelo.img) {
    return res.redirect(modelo.img)
    // const pathImagen = path.join(
    //   __dirname,
    //   '../uploads',
    //   coleccion,
    //   modelo.img,
    // )
    // if (fs.existsSync(pathImagen)) {
    //   return res.sendFile(pathImagen)
    // }
  }

  const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
  console.log(pathImagen)
  return res.sendFile(pathImagen)
  //res.json({ msg: 'Falta place holder' })
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
}