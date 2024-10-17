import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Accessed working/");

  res.send("Response from working/");
});

export default router;
