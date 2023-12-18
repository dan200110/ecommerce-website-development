const amqp = require('amqplib')
const { channel } = require('diagnostics_channel')

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:12345@localhost')
    if (!connection) throw new Error('Connection not established')

    const channel = await connection.createChannel()

    return { channel, connection }
  } catch (error) {}
}

const connectToRabbitMQForTest = async () => {
  try {
    const {channel, connection} = await connectToRabbitMQ()

    // Publish message to a queue
    const queue = 'test-queue'
    const message = 'This is my message'
    await channel.assertQueue(queue)
    await channel.sendToQueue(queue, Buffer.from(message))

    // close the connection
    await connection.close()
  } catch (error) {
    console.log('error connecting to RabbitMQ');
  }
}

const consumerQueue = async ( channel, queueName) => {
  try {
    await channel.assertQueue(queueName, {durable: true})
    console.log('Waiting for message');
    channel.consume(queueName, msg => {
      console.log(`Received message: ${queueName}`, msg.content.toString());
      // 1. Find user folowing that shop
      // 2. Send message to user
      // 3. yes, ok ==> success
      // 4. error, setup DLX ...
    }, {
      noAck: true
    })
  } catch (error) {
    console.log('error');
  }
}

module.exports = { connectToRabbitMQ, connectToRabbitMQForTest, consumerQueue }
