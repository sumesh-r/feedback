// imports
const router = require("express").Router();
require("dotenv").config();
const {
  addFeedbackForAdvisor,
} = require("../controllers/feedbackControllers/cFeedbackControllers.js");
const {
  deleteFeedbackForAdvisor,
} = require("../controllers/feedbackControllers/dFeedbackControllers.js");

const {
  updateFeedbackForAdvisor,
} = require("../controllers/feedbackControllers/uFeedbackControllers.js");

const {
  getFeedbackForAdvisor,
  getFeedbacksForAdvisor,
  getDashboardDetailsForAdvisor,
} = require("../controllers/feedbackControllers/rFeedbackControllers.js");

const {
  addStudentForAdvisor,
  addStudentsForAdvisor,
} = require("../controllers/studentControllers/cStudentControllers.js");
const {
  deleteStudentForAdvisor,
} = require("../controllers/studentControllers/dStudentControllers.js");
const {
  updateStudentForAdvisor,
} = require("../controllers/studentControllers/uStudentControllers.js");
const {
  getStudentForAdvisor,
  getStudentsForAdvisor,
} = require("../controllers/studentControllers/rStudentControllers.js");

//  route - /api/advisor...
// feedback
router.post("/feedback/add", addFeedbackForAdvisor);
router.post("/feedback/get", getFeedbackForAdvisor);
router.get("/feedbacks/get", getFeedbacksForAdvisor);
router.get(
  "/feedback/dashboard/get",
  getDashboardDetailsForAdvisor
);
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
