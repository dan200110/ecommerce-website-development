const express = require('express')
const inventoryController = require('../../controller/inventory.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const {authenticationV2} = require('../../auth/authUtils')

router.use(authenticationV2)
router.use('/v1/api/inventory', require('./inventory'))
router.post('', asyncHandler(inventoryController.addStockToInventory))

module.exports = router
