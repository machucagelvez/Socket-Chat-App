const { response } = require("express");
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo })
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario o password incorrecto (Se identificó revisando el correo)'
            })
        }

        //Verificar se el usuario está activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario o password incorrecto (Se identificó revisando el estado)'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario o password incorrecto (Se identificó revisando el password)'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id)
        
        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Ocurrió un error'
        })        
    }

}


module.exports = {
    login
}