const express = require('express')
const morgan = require('morgan')
const app = express()
const { default: helmet } = require('helmet')
const compression = require('compression')

// init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression)

// init db
require('./dbs/init.mongodb')
// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()


// init routes
app.get('/', (req, res, next) => {
  const strCompress = 'Hello World'
  return res.status(200).json({
    message: 'Successful',
    // metadata: strCompress.repeat(10000)
  })
})

// handling error

module.exports = app
