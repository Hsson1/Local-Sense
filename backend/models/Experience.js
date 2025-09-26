const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number, // price per person (in cents or smallest currency unit)
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number] // [lng, lat]
  },
  media: [String], // URLs to images/videos
  shortPreview: String, // short audio/video URL or excerpt
  capacity: Number,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  featuredUntil: Date
});
ExperienceSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Experience", ExperienceSchema);
