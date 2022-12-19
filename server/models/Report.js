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
    subjectKnowledge: {
      type: Number,
      required: true,
      default: 0,
    },
    clearExplanation: {
      type: Number,
      required: true,
      default: 0,
    },
    usageOfTeachingTools: {
      type: Number,
      required: true,
      default: 0,
    },
    extraInput: {
      type: Number,
      required: true,
      default: 0,
    },
    teacherStudentRelationship: {
      type: Number,
      required: true,
      default: 0,
    },
    averageTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    fourScaleRating: {
      type: Number,
      required: true,
      default: 0,
    },
    grade: {
      type: String,
      required: true,
    },
    totalStrength: {
      type: Number,
      required: true,
      default: 0,
    },
    totalResponse: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false, versionKey: false }
);

const reportSchema = mongoose.Schema(
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
    subjects: [subjectSchema],
  },
  { versionKey: false, timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = { Report };
