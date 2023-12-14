const CheckoutService = require('../services/checkout.service')

class CheckoutController {
  addToCart = async (req, res, nes) => {
    // new
    new checkoutReview({
      message: 'checkout review success',
      metadata: await CheckoutService.checkoutReview( req.body )
    }).send(res)
  }
}

module.exports = new CheckoutController()
