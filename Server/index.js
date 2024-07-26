// In SERVER/index.js
require("dotenv").config();
const app = require("./app");
const cors = require("cors");
const bodyParser = require("body-parser");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Server Port
const PORT = process.env.PORT || 4001;

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
