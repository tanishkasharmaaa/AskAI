const {cloudinary} = require("../config/cloudinary");
const generateImageFromPrompt = require("../AI/generateImage");
const fs = require("fs");
const AiGenerate = require("../model/AiGenerate");
const jwt = require("jsonwebtoken")

const generateImage = async(req,res)=>{
try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const { description, imageData } = await generateImageFromPrompt(prompt);

    const token = req.cookies.token||req.headers.authorization.split(" ")[1]
    if(!token) return res.status(400).json({message:"Token not found"})
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    const newImage = await AiGenerate.create({
      userId: decode.id || null,
      prompt,
      description,
      imageData,
    });

    res.status(201).json({
      message: "Image generated and saved",
      data: newImage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }

}

const updateImage = async(req,res)=>{
  
  try {
    const {prompt} = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const {description , imageData} = await generateImageFromPrompt(prompt);

    const newImage = await AiGenerate.findByIdAndUpdate(req.params.id,{
      prompt,
      description,
      imageData
    },{new:true});

    res.status(201).json({
      message: "Image updated and saved",
      data: newImage,
    });
  } catch (error) {
     console.error(err);
    res.status(500).json({ error: "Image generation failed" });
  }
}

const displayAll =async(req,res)=>{
  try {
      const token = req.cookies.token||req.headers.authorization.split(" ")[1];
      if(!token)return res.status(400).json({message:"Token not found"});
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
  
      const images = await AiGenerate.find({userId:decoded.id})
      res.status(200).json(images)
  } catch (error) {
      console.error(error.message)
      res.status(500).json({error})
  }
}
const deleteImage = async(req,res)=>{
  try {
      const token = req.cookies.token||req.headers.authorization.split(" ")[1];
      if(!token)return res.status(400).json({message:"Token not found"});
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
  
      const images = await AiGenerate.findByIdAndDelete(req.params.id)
      res.status(200).json({message:"Deleted successfully"})
  } catch (error) {
      console.error(error.message)
      res.status(500).json({error})
  }
}

module.exports = {generateImage,updateImage,displayAll,deleteImage}