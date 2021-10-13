const mongoose = require('mongoose')

//Conexión con la BD
const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.MONGODB_CNN)
        console.log('Base de datos online')
    } catch (error) {
        console.log(error)
        throw new Error('Error al iniciar la BD')
    }
}

module.exports = {
    dbConnection
}