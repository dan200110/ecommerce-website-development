
const discount = require("../models/discount.model");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_uses,
      used_count,
      user_used,
      max_uses_per_user,
    } = payload;
    // kiem tra
    // validate Date.today and start_date, end_date

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount already exist");
    }
    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_used: used_count,
      discount_users_used: user_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to === "all" ? [] : product_ids,
      discount_product_ids: product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount_code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exist!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      // get the product ids
      products = await findAllProducts({
        filter: {
          _ids: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  // get all discount code of Shop
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });

    return discounts;
  }

  /*
    Apply discount code
    products = [
        {
            productId,
            shopid,
            quantity,
            name,
            price
        },
        {
            productId,
            shopid,
            quantity,
            name,
            price
        }
    ]
  */

  static async getDiscountAmount({codeId, userId, shopId, products}){
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError('discount not exitst')

    const {discount_is_active, discount_min_order_value, discount_users_used} = foundDiscount
    /*
      check discount_is_active
      check discount_max_uses > 0
      check Date between start_date and end_date
    */

    // check xem có đạt giá trị đơn hàng tối thiểu
    let totalOrder = 0
    if(discount_min_order_value > 0){
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if(totalOrder < discount_min_order_value) {
        throw new NotFoundError('discount requires a mininmum order value of discount_min_order_value')
      }
    }


    // check xem discount nay la fixed_amount
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100.0)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({shopId, codeId}){
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId)
    })

    return deleted
  }


  static async cancelDiscountCode({codeId, shopId, userId}){
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if(!foundDiscount) throw new NotFoundError('discount do not exits')

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_used: -1
      }
    })

    return result
  }
}

const checkDiscountExists = (model, filter) => {
  return model.findOne({filter}).lean();
}
