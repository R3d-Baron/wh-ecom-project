const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const stockSchema = new mongoose.Schema(
  {
    variationId: {
      type: ObjectId,
      ref: "ProductVariation",
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Stock quantity is required."],
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
