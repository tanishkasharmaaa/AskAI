const mongoose = require("mongoose");

const editSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  prompt: { type: String, required: true },
  description: { type: String },
  imageData: { type: String, required: true }, // URL
  format: { type: String, enum: ["url"], default: "url" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EditSchema", editSchema);
