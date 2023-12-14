
const { resolve } = require('path')
const redis = require('redis')
const {promisify} =  require('util')
const { reservationInventory } = require('../repo/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productIt, quantity, cartId) => {
  const key = `lock_v2003_${productId}`
  const retryTimes = 10
  const expireTime = 3000 // 3 seconds tam lock

  for (let i = 0; i < retryTimes.length; i++) {
    //  tao mot key, thang nao giu duowc vao thanh toan
    const result = await setnxAsync(key, expireTime)
    if(result === 1) {
      // thao tac voi inventory
      const isReservation = await reservationInventory({
        productId, quantity, cartId
      })
      if(isReservation.modifiedCount){
        await pexpire(key, expireTime)
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
}
