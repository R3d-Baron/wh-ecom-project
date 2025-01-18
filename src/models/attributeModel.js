const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Attribute name is required."],
    },
    values: {
      type: [String], // Example: ["Red", "Blue", "Green"] for "Color"
      required: [true, "Attribute values are required."],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attribute", attributeSchema);
