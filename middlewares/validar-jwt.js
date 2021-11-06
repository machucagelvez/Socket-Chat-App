const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token')
    if(!token) {
        //OJO: el return es necesario para que salga de la app
        return res.status(401).json({
            msg: 'La petición no tiene token'
        })
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        //Leer el usuario que corresponde al uid:
        const usuario = await Usuario.findById(uid)

        //Verificar que exista el usuario:
        if(!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en DB'
            }) 
        } 
        
        //Verificar que el usuario esté activo:
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            }) 
        } 

        //Se crea un propiedad nueva dentro del objeto request, en este caso es usuario
        //Esa nueva propiedad irá en la request a partir de este middleware
        req.usuario = usuario
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido'
        })        
    }
}



module.exports = {
    validarJWT
}