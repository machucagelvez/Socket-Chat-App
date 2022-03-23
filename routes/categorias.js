const { Router } = require('express')
const { check } = require('express-validator')
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require('../controllers/categorias')
const { existeCategoriaPorId } = require('../helpers/db-validators')
const {
  validarJWT,
  validarCampos,
  esAdminRole,
} = require('../middlewares')

const router = Router()

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorías - público
router.get('/', obtenerCategorias)

// Obtener una categoría por id - público
router.get(
  '/:id',
  [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria,
)

// Crear categoría - privado - cualquiera con token válido
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  crearCategoria,
)

// Actualizar categoría - privado - cualquiera con token válido
router.put(
  '/:id',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria,
)

// Borrar una categoría - privado - Admin
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria,
)

module.exports = router
