// imports
const router = require("express").Router();
require("dotenv").config();
const {
  getFeedbackForStudent,
} = require("#feedbackControllers/rFeedbackControllers.js");

//  route - /api/student...
router.get("/feedback/get", getFeedbackForStudent);

module.exports = router;
