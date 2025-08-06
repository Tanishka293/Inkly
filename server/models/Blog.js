const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    comments: [
      {
        text: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
        replies: [
          {
            text: { type: String, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: { type: Date, default: Date.now }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
