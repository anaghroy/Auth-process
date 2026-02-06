require("dotenv").config();
const app = require("./src/app");
const ConnectToDB = require("./src/config/database")

/**Calling to Database */
ConnectToDB()

/**Calling to server */
app.listen(3000, () => {
  console.log("Server is running on port: 3000");
});
