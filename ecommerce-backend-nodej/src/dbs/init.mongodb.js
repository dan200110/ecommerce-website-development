'use strict'

const mongoose = require('mongoose')
const dbHost = process.env.DB_HOST || 'localhost'
const dbPort = process.env.DB_PORT || 27017
const dbName = process.env.DB_NAME || 'my_db_name'
const mongoUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`

const { countConnect } = require('../helpers/check.connect')

class Database {
  constructor () {
    this.connect()
  }

  connect (type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(mongoUrl, {
        maxPoolSize: 50
      })
      .then(_ => console.log(`Connected Mongodb Success`, countConnect()))
      .catch(err => console.log('Connected fail'))
  }

  static getInstance () {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
