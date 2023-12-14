const redisPubsubService = require("./redisPubsub.service");

class InventoryServiceTest{
  constructor(){
    redisPubsubService.subcriber('purchase_events', (channel, message) => {

    })
  }

  static updateInventory(productId, quantity){
    console.log(`Updated inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = new InventoryServiceTest()
