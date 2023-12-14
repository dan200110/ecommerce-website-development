const InventoryService = require('../services/inventory.service')

class InventoryController {
  addToCart = async (req, res, nes) => {
    // new
    new addStock({
      message: 'Create new addStockToInventory',
      metadata: await InventoryService.addStockToInventory( req.body )
    }).send(res)
  }
}

module.exports = new InventoryController()
