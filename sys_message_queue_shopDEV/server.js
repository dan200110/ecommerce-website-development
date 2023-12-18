const {consumerToQueue} = require('./src/services/consumerQueue.service')
const queueName = ''
consumerToQueue(queueName).then(() => {
  console.log(`Message consumer started ${queueName}`);
}).catch( err => {
  console.log('Message error', err.message);
})
