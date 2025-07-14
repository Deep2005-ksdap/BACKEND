const Stock = require("../model/item.model");


exports.getDashboard = async (req, res, next) => {
  const { itemName, category } = req.query;

  const allStock = await Stock.find({
    ...(itemName && { itemName }), //itemName exists than assigned value to itemName otherwise neglect by mongoose
    ...(category && { category }),
  });

  const inventoryValue = allStock.map(
    (item) => item.itemPrice * item.itemUnits
  );
  const addTotal = (inventoryValue) => {
    return inventoryValue.reduce((acc, curr) => acc + curr, 0);
  };
  const lowStockItems = allStock.filter((item) => item.itemUnits < 5);

  res.status(200).json({
    message: "You are in the dashboard",
    data: {
      message: allStock.length > 0 ? "Items found" : "No items found",
      allStock,
      lowStockItems,
      totalItems: allStock.length,
      addTotal: addTotal(inventoryValue),
    },
  });
};

exports.postStock = async (req, res, next) => {
  try {
    if (
      !req.body.itemName ||
      !req.body.itemPrice ||
      !req.body.itemUnits ||
      !req.body.category
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const { itemName, itemPrice, itemUnits, itemBrand, itemSize, category } =
      req.body;
    const newItem = new Stock({
      itemName,
      itemPrice,
      itemUnits,
      category,
      itemBrand: category === "electronics" ? itemBrand : undefined,
      itemSize: category === "clothing" ? itemSize : undefined,
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
  const itemName = req.params.itemName;
  const updatedData = req.body;
  if (updatedData.category) {
    if (updatedData.category === "electronics") {
      updatedData.itemBrand = updatedData.itemBrand || undefined;
      updatedData.itemSize = undefined;
    } else if (updatedData.category === "clothing") {
      updatedData.itemSize = updatedData.itemSize || undefined;
      updatedData.itemBrand = undefined;
    } else {
      updatedData.itemBrand = undefined;
      updatedData.itemSize = undefined;
    }
  }
  try {
    await Stock.findOneAndUpdate({ itemName }, updatedData);
    res.status(200).json({
      message: "Stock updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in updating the stock",
      error: error.message,
    });
  }
};

exports.deleteStock = async (req, res, next) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    await Stock.findByIdAndDelete(itemId);
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
