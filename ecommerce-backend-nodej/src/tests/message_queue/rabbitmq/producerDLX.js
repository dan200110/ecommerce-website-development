const amqp = require('amqplib')
const messages = 'hello, RabbitMQ'

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    const notificationExchange = 'notificationEx' // notificationEx direx
    const notiQueue = 'notificationQueueProcess' // assertQueue
    const notificationExchangeDLX = 'notificationExchangeDLX'
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

    // 1. create Exchange
    await channel.assertExchange(notiQueue, 'direct', {
      durable: true
    })

    // 2. Create Queue
    const queueResult = await channel.assertQueue( notiQueue, {
      exclusive: false, // cho phep cacs ket noi truy cap vao cung 1 hang doi
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    })

    // 3. bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange)

    // 4. Send message
    const msg = 'a new product'
    console.log(`producer msg::`, msg);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000'
    })


    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500)
  } catch(error) {
    console.error(error)
  }
}

runProducer().catch(console.error)
