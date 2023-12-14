const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    discount_name: { rype: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, // percentage
    discount_value: { type: Number, required: true }, // 10.000 or 10
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true }, // ngay start
    discount_end_date: { type: Date, required: true }, // ngay end
    discount_max_uses: { type: Number, required: true }, // so luong discount duoc ap dung
    discount_used: { type: Number, required: true }, // so discount da su dung
    discount_users_used: { type: Array, default: [] },
    discount_max_uses_per_user: { type: Number, required: true }, // so luong cho phep moi user
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // so san pham dc ap dung
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { inventory: modle(DOCUMENT_NAME, discountSchema) };
