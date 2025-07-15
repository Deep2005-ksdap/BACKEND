const Stock = require("../model/item.model");
const { checkStock } = require("../service/home.service");

exports.getDashboard = async (req, res, next) => {
  const ownerId = req.ownerId;
  const { itemname, category } = req.query;

  const allStock = await Stock.find({
    ownerId,
    ...(itemname && { itemname }),
    ...(category && { category }),
  });
  const addTotal = checkStock(allStock);
  const lowStockItems = addTotal.lowStockItems;
  const lowStockItemsCount = addTotal.lowStockItemsCount;
  res.status(200).json({
    message: "You are in the dashboard",
    data: {
      message: allStock.length > 0 ? "Items found" : "No items found",
      lowStockItems,
      lowStockItemsCount,
      totalStockValue: addTotal.totalStockValue,
      allStock,
    },
  });
};

exports.postStock = async (req, res, next) => {
  try {
    if (
      !req.body.itemname ||
      !req.body.itemprice ||
      !req.body.itemunits ||
      !req.body.category
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const ownerId = req.ownerId;
    const { itemname, itemprice, itemunits, itembrand, itemsize, category } =
      req.body;
    const newItem = new Stock({
      itemname,
      itemprice,
      itemunits,
      category,
      ownerId,
      itembrand: category === "electronics" ? itembrand : undefined,
      itemsize: category === "clothing" ? itemsize : undefined,
    });
    await newItem.save();
    res.status(201).json({
      message: "New stock added successfully",
      data: newItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding stock",
      error: error.message,
    });
  }
};

exports.editStock = async (req, res, next) => {
  const stockId = req.params.stockId;
  const ownerId = req.ownerId;
  const updatedData = req.body;
  console.log(stockId, ownerId, updatedData);

  // Validate required fields
  if (updatedData.category) {
    if (updatedData.category === "electronics") {
      updatedData.itembrand = updatedData.itembrand || undefined;
      updatedData.itemsize = undefined;
    } else if (updatedData.category === "clothing") {
      updatedData.itemsize = updatedData.itemsize || undefined;
      updatedData.itembrand = undefined;
    } else {
      updatedData.itembrand = undefined;
      updatedData.itemsize = undefined;
    }
  }

  try {
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({
        message: "Stock not found",
      });
    }

    if (ownerId !== stock.ownerId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to edit this stock",
      });
    }
    const updatedStock = await Stock.findByIdAndUpdate(stockId, updatedData, {
      new: true,
    });
    console.log("Updated Stock:", updatedStock);
    res.status(200).json({
      message: "Stock updated successfully",
      data: updatedStock,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in updating the stock",
      error: error.message,
    });
  }
};

exports.deleteStock = async (req, res, next) => {
  const stockId = req.params.id;

  console.log(stockId);
  try {
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({
        message: "Stock is not there already",
      });
    }
    if (stock.ownerId.toString() !== req.ownerId) {
      return res.status(403).json({
        message: "You can't delete this stock",
      });
    }
    await Stock.findByIdAndDelete(stockId);
    res.status(200).json({
      message: "Stock deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in deleting the stock",
      error: error.message,
    });
  }
};
