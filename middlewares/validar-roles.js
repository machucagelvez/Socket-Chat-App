const { response } = require('express')

const esAdminRole = (req, res = response, next) => {
  //req.usuario se generó en el middleware validar-jwt
  if (!req.usuario) {
    return res.status(500).json({
      msg: 'Se quiere verificar el role sin validar primero el token',
    })
  }

  const { rol, nombre } = req.usuario
  if (rol !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `Acción no permitida. ${nombre} no es administrador`,
    })
  }

  next()
}

//...roles mete todos los argumentos recibidos en un arreglo
const tieneRole = (...roles) => {
  //Como se recibieron los roles en la función ppal,
  //Al ser un middleware se debe utilizar req, res y next en la función interna
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se quiere validar el role sin validar primero el token',
      })
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `Debe tener uno de los siguientes roles: ${roles}`,
      })
    }

    next()
  }
}

module.exports = {
  esAdminRole,
  tieneRole,
}
