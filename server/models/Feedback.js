const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema(
  {
    subjectCode: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    facultyPosition: {
      type: String,
      required: true,
    },
    facultyDepartment: {
      type: String,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const electiveSubjectSchema = mongoose.Schema(
  {
    regNo: {
      type: Number,
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    facultyPosition: {
      type: String,
      required: true,
    },
    facultyDepartment: {
      type: String,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const feedbackSchema = mongoose.Schema(
  {
    batch: {
      type: Number,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    feedbackNo: {
      type: String,
      required: true,
    },
    isLive: { type: Boolean, default: false },
    subjects: [subjectSchema],
    electiveSubjects: [electiveSubjectSchema],
  },
  { versionKey: false, timestamps: true }
);


const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = { Feedback };
