// const userModel = require("../model/user.model");

// const userInfo = (userId) => {
//   userModel.User.findById(userId)
//     .then((user) => {
//       if (!user) {
//         throw new Error("User not found");
//       }
//       return {
//         fullname: user.fullname,
//         email: user.email,
//       };
//     })
//     .catch((error) => {
//       console.error("Error fetching user info:", error);
//       throw new Error("Internal server error");
//     });
// }