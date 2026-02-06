const express = require("express");
const authRouter = require("./routes/auth.routes");
const app = express();
const cookieParser = require("cookie-parser");

/**Middleware */
app.use(express.json());
app.use(cookieParser());

/**Calling Routers */
app.use("/api/auth", authRouter);

module.exports = app;
