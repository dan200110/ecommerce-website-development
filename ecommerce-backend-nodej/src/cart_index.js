routes/cart/indexedDB.js

const express = require('express')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()
const {asyncHandler} = require('./../auth/checkAuth')
const { authentiactionV2 } = require('../../auth/authUtils')
const checkoutController = require('./checkout.controller')

router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.update))
router.get('', asyncHandler(cartController.listToCart))


module.exports = router



router.post('/review', asyncHandler(checkoutController.checkoutReview))
