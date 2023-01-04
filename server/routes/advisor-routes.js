// imports
const router = require("express").Router();
require("dotenv").config();
const {
  addFeedbackForAdvisor,
} = require("#feedbackControllers/cFeedbackControllers.js");
const {
  deleteFeedbackForAdvisor,
} = require("#feedbackControllers/dFeedbackControllers.js");

const {
  updateFeedbackForAdvisor,
} = require("#feedbackControllers/uFeedbackControllers.js");

const {
  getFeedbackForAdvisor,
  getFeedbacksForAdvisor,
  getDashboardDetailsForAdvisor,
} = require("#feedbackControllers/rFeedbackControllers.js");

const {
  addStudentForAdvisor,
  addStudentsForAdvisor,
} = require("#studentControllers/cStudentControllers.js");
const {
  deleteStudentForAdvisor,
} = require("#studentControllers/dStudentControllers.js");
const {
  updateStudentForAdvisor,
} = require("#studentControllers/uStudentControllers.js");
const {
  getStudentForAdvisor,
  getStudentsForAdvisor,
} = require("#studentControllers/rStudentControllers.js");

//  route - /api/advisor...
// feedback
router.post("/feedback/add", addFeedbackForAdvisor);
router.post("/feedback/get", getFeedbackForAdvisor);
router.get("/feedbacks/get", getFeedbacksForAdvisor);
router.get("/feedback/dashboard/get", getDashboardDetailsForAdvisor);
router.post("/feedback/update", updateFeedbackForAdvisor);
router.post("/feedback/delete", deleteFeedbackForAdvisor);

// student
router.post("/student/add", addStudentForAdvisor);
router.post("/students/add", addStudentsForAdvisor);
router.post("/student/get", getStudentForAdvisor);
router.get("/students/get", getStudentsForAdvisor);
router.post("/student/update", updateStudentForAdvisor);
router.post("/student/delete", deleteStudentForAdvisor);

module.exports = router;
