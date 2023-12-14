const { findCartById } = require('../models/repositories/cart.repo')
const { acquireLock, releaseLock } = require('./redis.service')
const { order } = require('../models/order.model')
class CheckoutService {
  // login and without login

  /*
    {
      cartId,
      userId,
      shop_order_ids: [
        {
          shopId,
          shop_discount: [],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        },
        {
          shopId,
          shop_discount: [
            {
              shopId,
              discountId,
              codeId
            }
          ],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        }
      ]
    }
  */

  static async checkoutReview ({ cartId, userId, shop_order_ids }) {
    // check cartId ton tai khon?
    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new BadRequestError('Cart not found')

    const checkout_order = {
        totalPrice: 0, // Tong tien hang
        feeShip: 0, // Phi ship
        totalDiscount: 0, // Tong tien giam gia
        totalCheckout: 0 // tong thanh toan
      },
      shop_order_ids = []

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = []
      } = shop_order_ids[i]
      // check product available
      const checkProductByServer = checkProductByServer(item_products)
      if (!checkProductByServer[0]) throw new BadRequestError('order wrong')

      // tong tien don hang
      const checkoutPrice = checkProductByServer.reduce((acc, product) => {
        return acc + product.quantity * product.price
      }, 0)

      // tong tien truowc khi xu ly
      checkout_order.totalPrice = +checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductByServer
      }

      // neu shop_discounts tont ai > 0, check xem co hop le hay khong
      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductByServer
        })

        // tong cong discount giam gia
        checkout_order.totalDiscount += discount

        // neu tien giam gia lon hon 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids,
      checkout_order
    }
  }

  // order

  static async orderByUser ({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids: shop_order_ids
      })

    //  check lai mot lan nua xem vuot ton kho hay khong ?
    //  get new array products

    const products = shop_order_ids_new.flatMap(order => order.item_products)
    const acquireProduct = []
    for (let i = 0; i < products.length; i++) {
      const {productId, quantity} = products[i]
      const keyLock = await acquireLock(productId, quantity, cartId)
      acquireProduct.push( keyLock ? true: false )
      if(keyLock) {
        await releaseLock(keyLock)
      }
    }

    // check neu co mot san pham het hang trong kho
    if(acquireProduct.includes(false)){
      throw new BadRequestError(' Mot so san pham da duoc cap nhat, vui long quya lai gio hang')
    }

    // create order
    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      user_payment: user_payment,
      order_products: shop_order_ids_new
    })

    // Truong hop neu insert thanh cong, remove product co trong cart
    if(newOrder){
      // remove product in cart
    }
    return newOrder
  }

  /*
    1. Query Orders [Users]
  */

  static async getOrdersByUser() {

  }

  static async getOneOrderByUser() {

  }

  static async cancelOrderByUser() {

  }

  static async updateOrderStatusByShop() {

  }
}

module.exports = CheckoutService
