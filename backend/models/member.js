const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["core-member", "member"],
    },

    position: {
      type: String,
      required: true,
      enum: [
        "PR",
        "Content Writer",
        "Photographer",
        "Video Editor",
        "Graphic Designer",
        "Technical Member",
        "Web Developer",
        "President",
        "Vice-President",
        "Secretary",
        "Joint-Secretary",
        "Content-Head",
        "PR-Head",
        "Technical-Head",
        "Treasurer",
        "Media-Head",
        "GD-Head",
        "Manager",
        "Marketing-Head"
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);

