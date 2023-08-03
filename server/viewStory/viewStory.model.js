const mongoose = require("mongoose");

const viewStorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ViewStory", viewStorySchema);
