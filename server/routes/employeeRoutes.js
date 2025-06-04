const express = require("express");
const {
  fetchAllEmplyoee,
  deleteUser,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/", fetchAllEmplyoee);
router.delete("/:id", deleteUser);

module.exports = router;
