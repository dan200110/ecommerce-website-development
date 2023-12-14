const { model, Schema } = require('mongoose')
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-001: new PROMOTION
// SHOP-001: new product by user following

const NotificationSchema = new Schema(
  {
    noti_type: {type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], required: true},
    noti_senderdId: {type: Schema.Types.ObjectId, required: true, ref: 'Shop'},
    noti_receivedId: {type: Number, required: true},
    noti_content: {type:String, required: true},
    noti_options: {type: Object, default: {}}
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

module.exports = {
  NOTI: model(DOCUMENT_NAME, NotificationSchema)
}
