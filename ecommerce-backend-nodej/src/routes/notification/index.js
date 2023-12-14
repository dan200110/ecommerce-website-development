const express = require('express')
const nottificationController = require('../../controller/notification.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const {authenticationV2} = require('../../auth/authUtils')
// Here not login

// authentication
router.use(authenticationV2)
router.use('/v1/api/notification', require('./notification'))
router.post('', asyncHandler(nottificationController.addStockToInventory))

module.exports = router
