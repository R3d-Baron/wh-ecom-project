const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the product name"],
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    category: {
      type: ObjectId,
      ref: "categoriesCollection",
      required: [true, "Please specify the product category"],
    },
    description: {
      type: String,
      default: null,
    },
    attributes: [
      {
        type: ObjectId,
        ref: "Attribute",
        required: [true, "Please specify the product attribute"],
      },
    ],
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

module.exports = mongoose.model("productsCollection", productSchema);
