// imports
const router = require("express").Router();
require("dotenv").config();
const {
  addFeedbackForAdmin,
} = require("../controllers/feedbackControllers/cFeedbackControllers.js");
const {
  deleteFeedbackForAdmin,
} = require("../controllers/feedbackControllers/dFeedbackControllers.js");
const {
  updateFeedbackForAdmin,
} = require("../controllers/feedbackControllers/uFeedbackControllers.js");
const {
  getFeedbackForAdmin,
  getFeedbacksForAdmin,
} = require("../controllers/feedbackControllers/rFeedbackControllers.js");
const {
  getReportForAdmin,
  getReportsForAdmin,
} = require("../controllers/reportControllers/rReportControllers.js");
const {
  getAdvisorsForAdmin,
} = require("../controllers/advisorControllers/rAdvisorControllers.js");
const {
  addAdvisorForAdmin,
} = require("../controllers/advisorControllers/cAdvisorControllers.js");
const {
  updateAdvisorForAdmin,
} = require("../controllers/advisorControllers/uAdvisorControllers.js");
const {
  deleteAdvisorForAdmin,
} = require("../controllers/advisorControllers/dAdvisorControllers.js");
const {
  addStudentForAdmin,
  addStudentsForAdmin,
} = require("../controllers/studentControllers/cStudentControllers.js");
const {
  deleteStudentForAdmin,
} = require("../controllers/studentControllers/dStudentControllers.js");
const {
  updateStudentForAdmin,
} = require("../controllers/studentControllers/uStudentControllers.js");
const {
  getStudentForAdmin,
  getStudentsForAdmin,
} = require("../controllers/studentControllers/rStudentControllers.js");

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
