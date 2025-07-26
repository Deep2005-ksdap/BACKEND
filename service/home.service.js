const jwt = require("jsonwebtoken");

exports.checkUserMiddleware = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Login/Register first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in checkUserMiddleware:", error);
    return res.status(401).json({
      message: "Login/Register first",
      error: error.message,
    });
  }
};

exports.userCheck = (req, res, next) => {
  const ownerId = req.user.userId;
  const username = req.user.username;
  if (!ownerId) {
    return res.status(400).json({
      message: "Login first to access the feature",
    });
  }
  req.ownerId = ownerId;
  req.username = username;
  next();
}

exports.checkStock = (stock) => {
  const totalStockValue = stock.reduce((acc, item) => {
    return acc + item.itemprice * item.itemunits;
  }, 0);
  const lowStockItems = stock.filter(item => item.itemunits < 5);
  return {
    totalStockValue,
    lowStockItems,
    lowStockItemsCount: lowStockItems.length
  };
}