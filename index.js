const express = require("express");
const router = require("./src/routes/index.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/", router);

app.listen(5000, () => console.log("server running at port 5000"));
