// routes/category.js
const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

// Add a category
router.post("/add", async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                error: 'Category name is required' 
            });
        }

        const category = new Category({ 
            name,
            category_id: `CAT-${Date.now()}` // Generate unique category ID
        });

        const savedCategory = await category.save();
        
        res.status(201).json({
            success: true,
            data: savedCategory,
            message: "Category added successfully"
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error adding category'
        });
    }
});

// Get all categories
router.get("/", async (req, res) => {
    try {
        // Add query parameters for filtering
        const filter = {};
        if (req.query.active) {
            filter.active = req.query.active === 'true';
        }

        const categories = await Category.find(filter)
            .select('-__v')
            .sort({ createdAt: -1 });

        // Log for debugging
        console.log(`Retrieved ${categories.length} categories`);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({
            success: false,
            error: 'Error retrieving categories'
        });
    }
});

// Get single category by ID
router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error retrieving category:', error);
        res.status(500).json({
            success: false,
            error: 'Error retrieving category'
        });
    }
});

module.exports = router;