const { consumerQueue, connectToRabbitMQ } = require('../dbs/init.rabbitmq')

const messageService = {
  consumerToQueue: async queueName => {
    try {
      const { channel, connection } = await connectToRabbitMQ()
      await consumerQueue(channel, queueName)
    } catch (error) {
      console.log(' error consumerToQueue ')
    }
  },

  // case processing
  consumerToQueueNormal: async queueName => {
    try {
      const { channel, connection } = await connectToRabbitMQ()

      const notiQueue = 'notificationQueueProcess' // assertQueue

      // 1. TTL
      // const timeExpired = 15000
      // setTimeout(() => {
      //   channel.consume(notiQueue, msg => {
      //     console.log(
      //       `Send notifcationQueue sucessfully processed:`,
      //       msg.content.toString()
      //     )
      //     channel.ack(msg)
      //   })
      // }, timeExpired)

      // 2. Logic

      channel.consume(notiQueue, msg => {
        try {
          const numberTest = Math.random()
          console.log({ numberTest })

          if (numberTest < 0.8) {
            throw new Error('Send notification failed: Not fix')
          }

          console.log(
            `Send notifcationQueue sucessfully processed:`,
            msg.content.toString()
          )

          channel.ack(msg)
        } catch (error) {
          console.log('Send notification error', error);
          channel.nack(msg, false, false)
          /*
            nack: negative acknowledgement
            
          */
        }
      })
    } catch (error) {
      console.log(error)
    }
  },

  // case failed processing
  consumerToQueueFailed: async queueName => {
    try {
      const { channel, connection } = await connectToRabbitMQ()

      const notificationExchangeDLX = 'notificationExchangeDLX'
      const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
      const notiQueueHandler = 'notificationQueueHotFix'

      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true
      })

      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false
      })

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      )
      await channel.consume(
        queueResult.queue,
        msgFailed => {
          console.log(`This notification error`, msgFailed.content.toString())
        },
        {
          noAck: true
        }
      )
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = messageService
