const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const productVariationSchema = new mongoose.Schema(
  {
    productId: {
      type: ObjectId,
      ref: "productsCollection",
      required: true,
    },
    attributes: [
      {
        type: ObjectId,
        ref: "Attribute",
        required: [true, "Please specify the product attribute"],
      },
    ],
    image: {
      type: String,
      required: [true, "Image is required for the product variation."],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductVariation", productVariationSchema);
