// models/Category.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Category name is required'],
        trim: true
    },
    active: { 
        type: Boolean, 
        default: true 
    },
    category_id: { 
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    versionKey: false // Removes __v field
});

module.exports = mongoose.model("Category", CategorySchema);