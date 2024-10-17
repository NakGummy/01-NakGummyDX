import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Accessed management/");

  res.send("Response from management/");
});

export default router;
