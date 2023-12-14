const { inventory } = require("../models/inventory.model")

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inven_productId: convertToObjectIdMongodb(productId),
    inven_stock: {$gte: quantity}
  }, updateSet = {
    $inc: {
      inven_stock: -quantity
    },
    $push: {
      inven_reservations: {
        quantity,
        cartId,
        createOn: new Date()
      }
    }
  }, options = { upsert: true, new: true }

  return await inventory.updateOne(query, updateSet)
}

module.exports = { reservationInventory }
