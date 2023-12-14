const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

const cartSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
      order_checkout = {
        totalPrice,
        totalApllyDiscount,
        feeShip
      }
    */
    order_shipping: { type: Object, default: {} },
    /*
      street,
      city,
      state,
      country
    */
    order_payment: { type: Object, fefault: {} },
    order_products: { type: Array, required: true },
    order_trakingNumber: { type: String, default: '#00010520023'},
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'},
    
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn'
    }
  }
)

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema)
}
