// models/Category.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String },
  category_id: { type: String, $type: [String, null] },
}, { timestamps: true });

module.exports = mongoose.model("Category", CategorySchema);