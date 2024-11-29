const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  price: { type: Number, required: true },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
