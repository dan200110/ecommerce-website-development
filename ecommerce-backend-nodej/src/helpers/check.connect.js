'use strict'
const mongoose = require('mongoose')
const _SECONDS = 5000
const os = require('os')
const process = require('process')

const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`number of connection is: ${numConnection}`)
}

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // example maximum number of connections based on number of cores
    const maxConnections = 5
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    console.log(`Active connections: ${numConnection}`);

    if(numConnection > maxConnections){
      console.log('Connection overload detected');
    }

  }, _SECONDS) // Monitor every 5 seconds
}
module.exports = { countConnect, checkOverload }
