const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./root.env" });
module.exports = async (request, response, next) => {
  try {
    const token = request.header("token");
    if (!token) {
      return response.status(403).json("NOT AUTHORIZED");
    } else {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      request.user_id = payload.user_id;
    }
  } catch (error) {
    return response.status(403).json("NOT AUTHORIZED");
  }
  next();
};
