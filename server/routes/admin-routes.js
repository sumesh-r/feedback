// imports
const router = require("express").Router();
require("dotenv").config();
const {
  addFeedbackForAdmin,
} = require("#feedbackControllers/cFeedbackControllers.js");
const {
  deleteFeedbackForAdmin,
} = require("#feedbackControllers/dFeedbackControllers.js");
const {
  updateFeedbackForAdmin,
} = require("#feedbackControllers/uFeedbackControllers.js");
const {
  getFeedbackForAdmin,
  getFeedbacksForAdmin,
} = require("#feedbackControllers/rFeedbackControllers.js");
const {
  getReportForAdmin,
  getReportsForAdmin,
} = require("#reportControllers/rReportControllers.js");
const {
  getAdvisorsForAdmin,
} = require("#advisorControllers/rAdvisorControllers.js");
const {
  addAdvisorForAdmin,
} = require("#advisorControllers/cAdvisorControllers.js");
const {
  updateAdvisorForAdmin,
} = require("#advisorControllers/uAdvisorControllers.js");
const {
  deleteAdvisorForAdmin,
} = require("#advisorControllers/dAdvisorControllers.js");
const {
  addStudentForAdmin,
  addStudentsForAdmin,
} = require("#studentControllers/cStudentControllers.js");
const {
  deleteStudentForAdmin,
} = require("#studentControllers/dStudentControllers.js");
const {
  updateStudentForAdmin,
} = require("#studentControllers/uStudentControllers.js");
const {
  getStudentForAdmin,
  getStudentsForAdmin,
} = require("#studentControllers/rStudentControllers.js");

//  route - /api/a...
// feedback
router.post("/feedback/add", addFeedbackForAdmin);
router.post("/feedback/get", getFeedbackForAdmin);
router.get("/feedbacks/get", getFeedbacksForAdmin);
router.post("/feedback/update", updateFeedbackForAdmin);
router.post("/feedback/delete", deleteFeedbackForAdmin);

// report
router.post("/report/get", getReportForAdmin);
router.get("/reports/get", getReportsForAdmin);

// advisor
router.post("/advisor/add", addAdvisorForAdmin);
router.get("/advisors/get", getAdvisorsForAdmin);
router.post("/advisor/update", updateAdvisorForAdmin);
router.post("/advisor/delete", deleteAdvisorForAdmin);

// student
router.post("/student/add", addStudentForAdmin);
router.post("/students/add", addStudentsForAdmin);
router.post("/student/get", getStudentForAdmin);
router.post("/students/get", getStudentsForAdmin);
router.post("/student/update", updateStudentForAdmin);
router.post("/student/delete", deleteStudentForAdmin);

module.exports = router;