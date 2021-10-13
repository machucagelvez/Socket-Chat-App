const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario') //La mayúscula en 'Usuario' es un estándar, se hace porque se crean instancias de ese modelo

//res = response se usa para poder utilizar los métodos: res.metodo
const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query // TODO: validar que los params sean números
    const query = {estado: true}
    // const usuarios = await Usuario.find(query) //Busca los registros cuyo estado sea true
    //     .skip(Number(desde))
    //     .limit(Number(limite)) //limite es un string, se debe convertir a number
    // const total = await Usuario.countDocuments(query) //Cuenta el total de elementos en Usuario

    // Con Promise.all se ejecutan todas las promesas al tiempo, reduciendo el tiempo de respuesta
    // Si se hace con await, cada respuesta depende de que la anterior se resuelva
    // Desestructuración de arreglo:
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query) //Busca los registros cuyo estado sea true
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body
    //Crear una instancia del modelo Usuario
    const usuario = new Usuario({ nombre, correo, password, rol })

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(password, salt)

    //Guardar en BD
    await usuario.save()
    res.json({
        usuario
    })
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params
    //Sacar los parámetros que no se van a actualizar:
    const { _id, password, google, correo, ...datosActualizados } = req.body

    //TODO: Validar contra BD
    if(password) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync()
        datosActualizados.password = bcryptjs.hashSync(password, salt)
    }

    // {new: true} se utiliza para que se muestre la información actualizada
    // Sin eso mostraría el usuario antes de los cambios
    const usuario = await Usuario.findByIdAndUpdate(id, datosActualizados, {new: true})

    res.json({
        usuario
    })
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params
    // Borrar fisicamente:
    // const usuario = await Usuario.findByIdAndDelete(id)

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json({
        usuario
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador"
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}