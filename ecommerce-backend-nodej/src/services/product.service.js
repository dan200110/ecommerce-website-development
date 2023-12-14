const pushNotiToSystem = require("./notification.service")

class ProductService {
  async createProduct(product_id){
    const newProduct = await product.create(...this, _id = product_id)
    if(newProduct){
      // add product_stock in inventory collection

      // push noti to system collection
      pushNotiToSystem({
        type: 'SHOP-001',
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop
        }
      }).then(rs => console.log(rs))
      .catch(console.error)
    }
    return newProduct
  }
}
