const express = require("express");
const {
  deleteUser,
  getAllEmplyoee,
  getSingleEmployee,
} = require("../controllers/employeeController");
const { updateProfile } = require("../controllers/authController");
const { updateProfileValidator } = require("../validator/authValidator");
const uploadMiddleware = require("../middleware/multer");

const router = express.Router();

router.get("/", getAllEmplyoee);
router.delete("/:id", deleteUser);
router.get("/:id", getSingleEmployee);
router.put("/:id", uploadMiddleware, updateProfileValidator, updateProfile);

module.exports = router;
