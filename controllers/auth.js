const { response } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')
const { json } = require('express/lib/response')
const { DefaultTransporter } = require('google-auth-library')

const login = async (req, res = response) => {
  const { correo, password } = req.body

  try {
    //Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo })
    if (!usuario) {
      return res.status(400).json({
        msg: 'Usuario o password incorrecto (Se identificó revisando el correo)',
      })
    }

    //Verificar se el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'Usuario o password incorrecto (Se identificó revisando el estado)',
      })
    }

    //Verificar la contraseña
    const validPassword = bcryptjs.compareSync(
      password,
      usuario.password,
    )
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario o password incorrecto (Se identificó revisando el password)',
      })
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Ocurrió un error',
    })
  }
}

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body

  try {
    const { nombre, img, correo } = await googleVerify(id_token)

    let usuario = await Usuario.findOne({ correo })

    if (!usuario) {
      //Se debe crear el usuario
      const data = {
        nombre,
        correo,
        password: 'cualquiercosa',
        img,
        google: true,
      }
      usuario = new Usuario(data)
      console.log(usuario)
      await usuario.save()
    }

    //Si usuario está en DB pero estado en false:
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Usuario bloqueado',
      })
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar',
    })
  }
}

const renovarToken = async (req, res = response) => {
  const { usuario } = req

  //Generar el JWT
  const token = await generarJWT(usuario.id)

  res.json({
    usuario,
    token,
  })
}

module.exports = {
  login,
  googleSignIn,
  renovarToken,
}
