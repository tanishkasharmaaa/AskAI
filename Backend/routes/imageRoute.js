const express = require("express");
const router = express.Router();
const authMiddlware = require("../middleware/authMiddleware");
const {generateImage, displayAll, updateImage, deleteImage} = require("../controllers/image");

router.post("/generateImage",authMiddlware,generateImage)
router.patch("/updategeneratedImage/:id",authMiddlware,updateImage)
router.get("/displayImages",authMiddlware,displayAll)
router.delete("/delete/:id",authMiddlware,deleteImage)

module.exports = router 