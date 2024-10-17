import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Accessed onsite/");

  res.send("Response from onsite/");
});

export default router;
