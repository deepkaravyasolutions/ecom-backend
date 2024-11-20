const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Add a product
router.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send("Product added");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get products by category
router.get("/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
    
module.exports = router;
