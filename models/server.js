const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT

    //Paths
    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      productos: '/api/productos',
      uploads: '/api/uploads',
      usuarios: '/api/usuarios',
    }

    //Conectar a la BD
    this.conectarDB()

    //Middlewares
    this.middlewares()

    //Rutas de la aplicación
    this.routes()
  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {
    // CORS
    this.app.use(cors())

    // Lectura y parseo del body
    this.app.use(express.json())

    // Directorio público
    this.app.use(express.static('public'))

    // Fileupload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true, //Permite crear directorios al guardar un archivo (en caso de no existrir)
      }),
    )
  }

  routes() {
    //Llama al archivo en donde están las rutas:
    this.app.use(this.paths.auth, require('../routes/auth'))
    this.app.use(this.paths.buscar, require('../routes/buscar'))
    this.app.use(
      this.paths.categorias,
      require('../routes/categorias'),
    )
    this.app.use(this.paths.productos, require('../routes/productos'))
    this.app.use(this.paths.uploads, require('../routes/uploads'))
    this.app.use(this.paths.usuarios, require('../routes/usuarios'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor ejecutándose en puerto', this.port)
    })
  }
}

module.exports = Server
