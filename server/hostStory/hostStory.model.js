const mongoose = require("mongoose");

const hostStorySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: null,
    },
    video: {
      type: String,
      default: null,
    },
    startDate: String,
    endDate: String,
    view: {
      type: Number,
      default: 0,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("HostStory", hostStorySchema);
