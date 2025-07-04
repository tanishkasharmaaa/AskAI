require("dotenv").config();
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {editImage, updateEditPrompt, displayAll} = require("../controllers/editImage");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/",authMiddleware,upload.single("image"),editImage);
router.patch("/edit/:id",authMiddleware,updateEditPrompt)
router.get("/edits",authMiddleware,displayAll)


module.exports = router;
