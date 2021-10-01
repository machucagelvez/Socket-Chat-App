//Extrae Router de express:
const { Router } = require('express')
const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios')

const router = Router()

//En este caso no se ejecuta la función usuariosGet(), se llama a esa referencia
router.get('/', usuariosGet)

router.post('/', usuariosPost)

router.put('/:id', usuariosPut)

router.delete('/', usuariosDelete)

router.patch('/', usuariosPatch)


module.exports = router