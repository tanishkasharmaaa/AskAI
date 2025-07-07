require("dotenv").config();
const editmodel = require("../model/edit");
const getEditInstructions = require("../utils/getEditInstructions");
const cloudinary = require("cloudinary")
const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")
const sharp = require("sharp")
const axios = require("axios")

const editImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const filePath = req.file.path;

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token not found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const instruction = await getEditInstructions(prompt);

    let image = sharp(filePath);
    const edits = instruction.split(",").map((e) => e.trim());

    for (let edit of edits) {
      if (edit === "grayscale") image = image.grayscale();
      else if (edit.startsWith("resize")) {
        const match = edit.match(/resize (\d+)x(\d+)/);
        if (match) image = image.resize(+match[1], +match[2]);
      } else if (edit === "blur") image = image.blur();
      else if (edit.startsWith("rotate")) {
        const match = edit.match(/rotate (\d+)/);
        if (match) image = image.rotate(+match[1]);
      } else if (edit === "flip") image = image.flip();
      else if (edit === "flop") image = image.flop();
      else if (edit.startsWith("brightness")) {
        const match = edit.match(/brightness (\d+(\.\d+)?)/);
        if (match) image = image.modulate({ brightness: +match[1] });
      } else if (edit.startsWith("contrast")) {
        const match = edit.match(/contrast (\d+(\.\d+)?)/);
        if (match) image = image.linear(+match[1], 0);
      } else if (edit === "sharpen") image = image.sharpen();
      else if (edit.startsWith("add text")) {
        const text = edit.match(/add text '(.*)'/)?.[1];
        if (text) {
          const svg = `<svg width="512" height="100">
            <style>
              .title { fill: white; font-size: 40px; font-weight: bold; }
            </style>
            <text x="20" y="50" class="title">${text}</text>
          </svg>`;
          image = image.composite([{ input: Buffer.from(svg), top: 10, left: 10 }]);
        }
      }
    }

    // ✅ Save to /tmp folder instead of uploads/
    const editedImagePath = path.join("/tmp", `edited-${Date.now()}.png`);
    await image.toFile(editedImagePath);

    const uploaded = await cloudinary.uploader.upload(editedImagePath, {
      folder: "AskAI_Images",
    });

    // ✅ Cleanup both temp files
    fs.unlinkSync(filePath);
    fs.unlinkSync(editedImagePath);

    const saved = await editmodel.create({
      userId,
      prompt,
      description: `Edit applied: ${instruction}`,
      imageData: uploaded.secure_url,
    });

    res.status(201).json({
      message: "Image edited and uploaded successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to edit and upload image" });
  }
};


const updateEditPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageId = req.params.id;

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const imageDoc = await editmodel.findById(imageId);
    if (!imageDoc) return res.status(404).json({ message: "Image not found" });

    if (imageDoc.userId.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    // ✅ Save original image temporarily to /tmp
    const originalUrl = imageDoc.imageData;
    const originalFilePath = path.join("/tmp", `original-${Date.now()}.png`);

    const writer = fs.createWriteStream(originalFilePath);
    const response = await axios({
      method: "get",
      url: originalUrl,
      responseType: "stream",
    });
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const instruction = await getEditInstructions(prompt);
    console.log("Updated edit instructions:", instruction);

    let image = sharp(originalFilePath);
    const edits = instruction.split(",").map((e) => e.trim());

    for (let edit of edits) {
      if (edit === "grayscale") image = image.grayscale();
      else if (edit.startsWith("resize")) {
        const match = edit.match(/resize (\d+)x(\d+)/);
        if (match) image = image.resize(+match[1], +match[2]);
      } else if (edit === "blur") image = image.blur();
      else if (edit.startsWith("rotate")) {
        const match = edit.match(/rotate (\d+)/);
        if (match) image = image.rotate(+match[1]);
      } else if (edit === "flip") image = image.flip();
      else if (edit === "flop") image = image.flop();
      else if (edit.startsWith("brightness")) {
        const match = edit.match(/brightness (\d+(\.\d+)?)/);
        if (match) image = image.modulate({ brightness: +match[1] });
      } else if (edit.startsWith("contrast")) {
        const match = edit.match(/contrast (\d+(\.\d+)?)/);
        if (match) image = image.linear(+match[1], 0);
      } else if (edit === "sharpen") image = image.sharpen();
      else if (edit.startsWith("add text")) {
        const text = edit.match(/add text '(.*)'/)?.[1];
        if (text) {
          const svg = `<svg width="512" height="100">
            <style>
              .title { fill: white; font-size: 40px; font-weight: bold; }
            </style>
            <text x="20" y="50" class="title">${text}</text>
          </svg>`;
          image = image.composite([{ input: Buffer.from(svg), top: 10, left: 10 }]);
        }
      }
    }

    // ✅ Save new image to /tmp
    const newPath = path.join("/tmp", `updated-${Date.now()}.png`);
    await image.toFile(newPath);

    const uploadResult = await cloudinary.uploader.upload(newPath, {
      folder: "AskAI_Images",
    });

    // ✅ Cleanup temp files
    fs.unlinkSync(originalFilePath);
    fs.unlinkSync(newPath);

    // ✅ Update DB
    imageDoc.prompt = prompt;
    imageDoc.description = `Updated edit applied: ${instruction}`;
    imageDoc.imageData = uploadResult.secure_url;
    await imageDoc.save();

    res.status(200).json({
      message: "Image updated successfully",
      data: imageDoc,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update image" });
  }
};


const displayAll =async(req,res)=>{
  try {
      const token = req.cookies.token||req.headers.authorization.split(" ")[1];
      if(!token)return res.status(400).json({message:"Token not found"});
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
  
      const images = await editmodel.find({userId:decoded.id})
      res.status(200).json(images)
  } catch (error) {
      console.error(error.message)
      res.status(500).json({error})
  }
}

module.exports = {editImage, updateEditPrompt,displayAll}