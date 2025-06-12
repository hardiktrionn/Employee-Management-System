import { Request, Response } from "express";
import Post from "../schema/postSchema";
import * as Yup from "yup";

// Yup validation schema
const postValidation = Yup.object({
  title: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category Required"),
});

// interfaces
interface PostBody {
  title: string;
  description: string;
  prompt?: string;
  category: string;
  tags: string[];
}

interface CreatePostReq extends Request {
  body: PostBody;
}

// Create a Post
export const createPost = async (
  req: CreatePostReq,
  res: Response
): Promise<void> => {
  try {
    // validate the post data
    await postValidation.validate(req.body);
    const { title, description, prompt, category, tags } = req.body;

    // insert into db
    const data = await Post.create({
      title,
      description,
      prompt,
      category,
      tags,
    });

    res.status(200).json({ success: true, message: "Post Created", data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: err.errors || err.message,
    });
  }
};

// Delete a Post
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check post exist or not
    const isExists = await Post.findById(id);
    if (!isExists) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    // delete post
    await Post.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: err.errors || err.message,
    });
  }
};

// Update a Post
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check post exist or not
    const isExists = await Post.findById(id);
    if (!isExists) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    // update post
    const data = await Post.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, data, message: "Post Updated" });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: err.errors || err.message,
    });
  }
};

// get Post Data throw id
export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check post exist or not
    const data = await Post.findById(id).populate("category", "name");
    if (!data) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error geting post",
      error: err.errors || err.message,
    });
  }
};

// get All Post Data throw id
export const getAllPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // get all post
    const data = await Post.find().populate("category", "name");

    res.status(200).json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Error geting post",
      error: err.errors || err.message,
    });
  }
};
