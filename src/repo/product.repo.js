const getProductById = async (productId) => {
  return await product.findOne({_id: convertObjectIdMongoDb(productId)}).lean()
}

const checkProductByServer = async (products) => {
  return await Promise.all(products.map(async product => {
    const foundProduct = await getProductById(product.productId)
    if(foundProduct){
      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
}
