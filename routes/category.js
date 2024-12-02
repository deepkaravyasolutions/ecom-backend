const express = require("express");
const Category = require("../models/Category");
const authenticateJWT = require("./authenticationMiddleware");

const router = express.Router();

router.post('/add', authenticateJWT, async (req, res) => {
    // console.log("add category req.body : ", req.body);
    try {
        let categoryData = req.body;
        categoryData.status = categoryData?.status?.toLowerCase();
        const newCategory = new Category(categoryData);
        await newCategory.save();
        res.send("Category added!");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

router.put('/update/:id', authenticateJWT, async (req, res) => {
    // console.log("Update Category Request Body:", req.body);
    const categoryId = req.params.id;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        // console.log("Category updated:", updatedCategory);
        res.status(200).json(updatedCategory);
    } catch (err) {
        console.error("Error updating category:", err);
        res.status(500).json({ error: err.message || "Failed to update category" });
    }
});

router.delete('/delete/:id', authenticateJWT, async (req, res) => {
    const categoryId = req.params.id;

    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        // console.log("Category deleted: ", deletedCategory);
        res.status(200).json({ message: "Category deleted successfully" })
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
})

router.get("/sub-categories", async (req, res) => {
    try {
        const subCategories = await Category.find({
            category_id: { $ne: null }
        });

        if (subCategories.length === 0) {
            return res.status(404).json({ message: "No sub-categories found" });
        }

        res.status(200).json(subCategories);

    } catch (error) {
        console.error("Error retrieving sub-categories:", error);
        res.status(500).json({ error: "Failed to retrieve sub-categories" });
    }
});
/**
 * push the code before making any changes. 
 * I don't have password for username:deep.karavyasolutions so code could not be pushed.
 * 
 */

router.get("/", async (req, res) => {
    console.log("req.query: ", req.query);
    const searchParams = req.query.search;
    const page = parseInt(req.query.page) || 1; // Get the current page, default to 1
    const limit = parseInt(req.query.limit) || 10; // Number of records per page, default to 10

    try {
        if (searchParams) {
            const categories = await Category.find({
                name: { $regex: searchParams, $options: 'i' }
            }).skip((page - 1) * limit).limit(limit);

            const totalCategories = await Category.find({
                name: { $regex: searchParams, $options: 'i' }
            });

            const totalPages = Math.ceil(totalCategories / limit);
            

            if (!categories || categories.length === 0) {
                return res.status(404).json({ message: "No filtered categories found" });
            }

            res.status(200).json({
                categories,
                totalPages,
              });
        } else {
            const categories = await Category.find({})
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const totalCategories = await Category.countDocuments({});
            const totalPages = Math.ceil(totalCategories / limit);


            if (!categories || categories.length === 0) {
                return res.status(404).json({ message: "No categories found" });
            }

            res.status(200).json({
                categories,
                totalPages,
              });
        }

    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ error: "Failed to retrieve categories" });
    }
});

module.exports = router;