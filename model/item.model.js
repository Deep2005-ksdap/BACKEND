const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemname: {
      type: String,
      required: true,
    },
    itemprice: {
      type: Number,
      required: true,
    },
    itemunits: {
      type: Number,
      required: true,
    },
    itembrand: {
      type: String,
    },
    itemsize: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    }
  },
  { timestamps: true }
);

const Stock = mongoose.model("stock", itemSchema);

module.exports = Stock;
