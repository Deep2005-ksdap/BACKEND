const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    itemUnits: {
      type: Number,
      required: true,
    },
    itemBrand: {
      type: String,
    },
    itemSize: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Stock = mongoose.model("stock", itemSchema);

module.exports = Stock;
