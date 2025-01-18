const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const pricingSchema = new mongoose.Schema(
  {
    variationId: {
      type: ObjectId,
      ref: "ProductVariation",
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
    },
    discount: {
      type: Number, // Discount in percentage
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pricing", pricingSchema);
