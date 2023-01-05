// imports
const router = require("express").Router();
require("dotenv").config();
const {
  getFeedbackForStudent,
} = require("#feedbackControllers/rFeedbackControllers.js");
const {
  submitFeedbackForStudent, // actually the data is saved in reports
} = require("#reportControllers/uReportControllers.js")

//  route - /api/student...
router.get("/feedback/get", getFeedbackForStudent);
router.post("/feedback/submit",submitFeedbackForStudent);

module.exports = router;
