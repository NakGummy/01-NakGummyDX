// Import Field
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import managementRoutes from "./Routes/managementRoutes.js";
import onsiteRoutes from "./Routes/onsiteRoutes.js";
import workingRoutes from "./Routes/workingRoutes.js";

// Forward Initializer
dotenv.config();

// Set Constants
const port = process.env.BACKEND_PORT || 5000;
const app = express();

// Deffered Initializer
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/////////////////////////////
// Main
/////////////////////////////
// 以下がバックエンドサーバーの立ち上げ部分です。

// Start Server
app.listen(port, (req, res) => {
  console.log(`Server is up on ${port}!`);
});

// Home Request Handler
app.get("/", (req, res) => {
  console.log("Accessed home/");

  res.send("Response from home/");
});

app.use("/management", managementRoutes);
app.use("/onsite", onsiteRoutes);
app.use("/working", workingRoutes);
