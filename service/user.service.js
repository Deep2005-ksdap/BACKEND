const jwt = require("jsonwebtoken");

exports.checkUserMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  console.log("Token received:", token);
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }
  jwt.verify(token, "secrets", (err, decoded) => {
    if (err) {
      console.error("Error verifying JWT:", err);
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
    req.user = decoded;
    console.log("User verified:", req.user);
    next();
  });
};
