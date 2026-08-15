const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Tech Monday",
        "Tech Photography",
        "Walking Wednesday",
        "Thought Thursday",
        "Quiz Friday",
        "General",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);

