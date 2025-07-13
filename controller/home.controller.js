const Stock = require("../model/item.module");

exports.getHome = (req, res, next) => {
  res.status(200).json({
    message: "Welcome to the Inventory Tracker APP",
  });
};

exports.getDashboard = async (req, res, next) => {
  const { itemName, category } = req.query;
  console.log("Query Parameters:", { itemName, category });

  const allStock = await Stock.find({
    ...(itemName && { itemName }), //itemName exists than assigned value to itemName
    ...(category && { category }),
  });

  res.status(200).json({
    message: "You are in the dashboard",
    data: {
      allStock,
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
  console.log(itemName);
  const updatedData = req.body;
  console.log(updatedData);
  try {
    await Stock.findOneAndUpdate({ itemName }, updatedData);
    console.log("Stock updated successfully");
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
