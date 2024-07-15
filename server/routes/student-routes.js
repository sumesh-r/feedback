// imports
const router = require("express").Router();
require("dotenv").config();
const {
  getFeedbackForStudent,
} = require("../controllers/feedbackControllers/rFeedbackControllers.js");
const {
  submitFeedbackForStudent, // actually the data is saved in reports
} = require("../controllers/reportControllers/uReportControllers.js");

//  route - /api/student...
router.get("/feedback/get", getFeedbackForStudent);
router.post("/feedback/submit", submitFeedbackForStudent);

module.exports = router;
