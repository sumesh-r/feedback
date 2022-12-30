const {
  addFeedback,
  deleteFeedback,
  updateFeedbackSubject,
  addFeedbackSubject,
  deleteFeedbackSubject,
  updateFeedbackForAdvisor,
  updateFeedbackForAdmin,
} = require("../controllers/feedback-controller");
const express = require("express");
const router = express.Router();
const feedbackValidationSchema = require("#validation/feedback-validation.js");
const { checkStaffAuth, checkAdminAuth } = require("#middlewares/checkAuth.js");
const validateData = require("#middlewares/validateData.js");

// staff routes
router.post("/staff", checkStaffAuth, addFeedback);
router.post("/staff/delete", checkStaffAuth, deleteFeedback);
// router.post("/staff/subject/update", checkStaffAuth, updateFeedbackSubject);
// router.post("/staff/subject/delete", checkStaffAuth, deleteFeedbackSubject);
router.post("/staff/update/", checkStaffAuth, updateFeedbackForAdvisor);
router.post("/staff/subject/", checkStaffAuth, addFeedbackSubject);

// admin routes
router.post("/a", checkAdminAuth, addFeedback);
router.post("/a/update/", checkAdminAuth, updateFeedbackForAdmin);

module.exports = router;
