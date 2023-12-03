'use strict'

const mongoose = require('mongoose')
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017
const dbName = process.env.DB_NAME || 'my_db_name'
const mongoUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`

mongoose.connect(mongoUrl).then(_ => console.log('Connected Mongodb Success'))
.catch(err => console.log('Connected fail'))

if (1===0) {
  mongoose.set('debug', true)
  mongoose.set('debug', {color: true})
}

module.exports = mongoose
