require("dotenv").config();
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {editImage, updateEditPrompt, displayAll, deleteEdits} = require("../controllers/editImage");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/editimage",authMiddleware,upload.single("image"),editImage);
router.patch("/edit/:id",authMiddleware,updateEditPrompt)
router.get("/edits",authMiddleware,displayAll)
router.delete("/delete_edit/:id",authMiddleware,deleteEdits)

module.exports = router;
