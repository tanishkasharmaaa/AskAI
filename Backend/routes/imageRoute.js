const express = require("express");
const router = express.Router();
const authMiddlware = require("../middleware/authMiddleware");
const {generateImage, displayAll, updateImage} = require("../controllers/image");

router.post("/generateImage",authMiddlware,generateImage)
router.patch("/updategeneratedImage/:id",authMiddlware,updateImage)
router.get("/displayImages",authMiddlware,displayAll)

module.exports = router 