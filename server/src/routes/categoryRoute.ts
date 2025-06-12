import { upload } from "../middleware/multer"
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "../controllers/categoryController"
import Express, { RequestHandler } from "express"

const route = Express.Router()

route.post("/create", upload.single("banner"), createCategory as RequestHandler)
route.delete("/:id", deleteCategory as RequestHandler)
route.put("/:id", upload.single("banner"),updateCategory as RequestHandler)
route.get("/:name",getCategory as RequestHandler)
route.get("/", getAllCategory as RequestHandler)

export default route