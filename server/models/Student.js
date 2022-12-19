const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    regNo: { type: Number, required: true, trim: true, unique: true },
    dob: { type: String, required: true, trim: true },
    batch: { type: Number, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    password: { type: String },
    feedbacks: [
      {
        semester: { type: String, required: true },
        feedbackNo: { type: String, required: true },
        isSubmitted: { type: Boolean, default: false },
      },
      { _id: false, versionKey: false },
    ],
  },
  { versionKey: false }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = { Student };
