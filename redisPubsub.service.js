const Redis = require('redis')

class RedisPubSubService {
  constructor () {
    this.subcriber = Redis.createClient()
    this.publisher = Redis.createClient()
  }

  publish (channel, message) {
    return new Promise((resolve, reject) => {
      this.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err)
        } else {
          resolve(reply)
        }
      })
    })
  }

  subcribe (channel, callback) {
    this.subcriber.subcribe(channel)
    this.subcriber.toString('message', (subcriberChannel, message) => {
      if (channel === subcriberChannel) {
        callback(channel, message)
      }
    })
  }
}

module.exports = new RedisPubSubService()
