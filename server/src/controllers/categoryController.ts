import Category from "../schema/categorySchema";
import Post from "../schema/postSchema"
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import * as Yup from "yup";

// Yup validation schema
const categoryValidation = Yup.object({
    name: Yup.string().required("Name is required"),
    banner: Yup.string().required("Banner is required"),
});

// Remove image form directory
const removeImage = (filename: string) => {
    if (fs.existsSync(filename)) {
        fs.unlinkSync(filename); //
    }
}
// Interfaces
interface CategoryRequest extends Request {
    body: {
        name: string;
        banner: string;
    };
    file?: Express.Multer.File;
}

// Create a new category
export const createCategory = async (req: CategoryRequest, res: Response): Promise<void> => {
    try {
        // Get filename from uploaded file
        req.body.banner = req.file?.originalname || "";

        // Validate incoming data
        await categoryValidation.validate(req.body);

        const { name, banner } = req.body;

        // Check if category already exists
        const exists = await Category.findOne({ name });
        if (exists) {
            res.status(400).json({ success: false, message: "Category already exists" });
            return;
        }

        // Build full URL for banner
        const bannerUrl = `http://localhost:3001/upload/${banner}`;

        // Create and save category
        const category = await Category.create({ name, banner: bannerUrl });

        res.status(201).json({ success: true, category });
    } catch (err: any) {
        removeImage(req.file?.originalname || "")
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.errors || err.message || "Unknown error",
        });
    }
};

// Delete Category Controller
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return;
        }

        // Extract filename from the URL
        const bannerFilename = category.banner.split("/").pop(); // e.g., banner.jpg

        if (bannerFilename) {
            const filePath = path.join(__dirname, "..", "public", "upload", bannerFilename);

            removeImage(filePath)

        }

        // Delete category from DB
        await Category.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Category and banner deleted" });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: err.errors || err.message,
        });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        // Check Category Exits or not
        if (!category) {
            res.status(404).json({ success: false, message: "Category not found" });
            return
        }

        // new Banner 
        const newFilename = req.file?.originalname || category.banner.split("/").pop();
        const bannerUrl = `http://localhost:3001/upload/${newFilename}`;

        if (req.file) {
            const oldFile = path.join(__dirname, "..", "public", "upload", category.banner.split("/").pop() || "");
            // Remove old img
            removeImage(oldFile)
        }

        const updatedData = { name: req.body.name, banner: bannerUrl };

        // update data
        const updated = await Category.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({ success: true, category: updated });
    } catch (err: any) {
        res.status(500).json({ success: false, message: "Update failed", error: err.errors || err.message });
    }
}

// get Post Data throw name
export const getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        // Check post exist or not
        const data = await Category.findOne({ name })


        if (!data) {
            res.status(404).json({ success: false, message: "Post not found" });
            return;
        }
        let posts = await Post.find({ category: data._id })

        res.status(200).json({ success: true, ...data.toObject(), posts });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Error geting post",
            error: err.errors || err.message,
        });
    }
};

// get All Post Data throw id
export const getAllCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // get all category with post 
        const data = await Category.find()

        const categoriesWithPosts = await Promise.all(
            data.map(async (category) => {
                // fetch 4 four post
                const posts = await Post.find({ category: category._id }).select("title").limit(4);

                // extract thier title
                const postTitles = posts.map((post) => post.title);
                return { ...category.toObject(), postTitles };
            })
        );

        res.status(200).json({ success: true, data: categoriesWithPosts });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Error geting post",
            error: err.errors || err.message,
        });
    }
};