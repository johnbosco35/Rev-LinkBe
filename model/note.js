const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const NoteSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    topic: {
      type: String,
      default: "enabled",
    },
    content: String,
    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Term",
    },
    week: String,
    attachments: [
      {
        type: Map,
        of: String,
      },
    ],
    videoUrl: { type: Map, of: String, nullable: true },
  },
  { timestamps: true, versionKey: false }
);

NoteSchema.plugin(mongoosePaginate);

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
