const express = require("express");
const cors = require("cors");
const ordremission = require("./routes/ordremissionRoute");
const budgetdetailRouter = require("./routes/budgetdetailRoutes");
const budgetRouter = require("./routes/budgetRoutes");
const employeeRouter = require("./routes/employeeRoutes");
const mandatRouter = require("./routes/mandatRoutes");
const gradesRouter = require("./routes/gradesRoutes");
const userRoutes = require("./routes/userRoute");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", userRoutes);
app.use("/ordremission", ordremission);
app.use("/budgetdetail", budgetdetailRouter);
app.use("/budget", budgetRouter);
app.use("/employee", employeeRouter);
app.use("/mandat", mandatRouter);
app.use("/grades", gradesRouter);

module.exports = app;
