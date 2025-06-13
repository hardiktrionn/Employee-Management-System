import { createRequest, getAllRequest, getRequest } from "../controllers/contactController";
import express, { RequestHandler } from "express";

const router = express.Router();

router.post("/create", createRequest as RequestHandler);
router.get("/", getAllRequest as RequestHandler);
router.get("/:id", getRequest as RequestHandler);

export default router;
