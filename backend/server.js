const dotenv = require("dotenv");
const express = require("express");
const prisma = require("./Config/database.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./Middleware/errorhandler/index.js");
const auth_router = require("./Routes/Auth");
const user_router = require("./Routes/User");
const ApplicationController = require("./Routes/Application");
const OneLink = require('./Routes/OneLink/index.js');
const Product = require('./Routes/Products/index.js');
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.options("*", cors());

app.use(errorHandler);
app.get("/api", (req, res) => {
  res.send("This is a Node backend");
});

app.use("/api/auth", auth_router);
app.use("/api/user", user_router);
app.use("/api/application", ApplicationController);
app.use("/api/oneLinkAuth", OneLink);
app.use("/api/getProduct", Product);

const PORT = process.env.SERVER_PORT;
(async () => {
  try {
    console.log(process.env.DATABASE_URL);
    await prisma.$connect();
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})();
