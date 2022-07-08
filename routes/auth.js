const { Router } = require('express')
const { check } = require('express-validator')
const {
  login,
  googleSignIn,
  renovarToken,
} = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()

router.post(
  '/login',
  [
    check('correo', 'Debe ser un correo válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login,
)

router.post(
  '/google',
  [
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos,
  ],
  googleSignIn,
)

router.get('/', validarJWT, renovarToken)

module.exports = router
