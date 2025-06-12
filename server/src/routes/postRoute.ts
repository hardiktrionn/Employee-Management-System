import Express, { RequestHandler } from "express"
import { createPost, deletePost, updatePost, getPost, getAllPost } from "../controllers/postController"

const route = Express.Router()

route.post("/create", createPost as RequestHandler)
route.delete("/:id", deletePost as RequestHandler)
route.put("/:id", updatePost as RequestHandler)
route.get("/:id", getPost as RequestHandler)
route.get("/", getAllPost as RequestHandler)

export default route