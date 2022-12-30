const express = require("express");
const router = express.Router();
const {
  addStudents,
  // getStudent,
  getStudents,
  updateStudents,
  deleteStudents,
} = require("../controllers/student-controller");
const studentValidationSchema = require("../utils/validation/student-validation");
const { checkStudentAuth } = require("../utils/middlewares/checkAuth");
const validateData = require("../utils/middlewares/validateData");
const {
  getFeedbackForStudent,
  submitFeedbackForStudent,
} = require("../controllers/feedback-controller");

const { getStudent } = require("#feedbackControllers/wFeedback.js");

// set routes
router.post("/", validateData(studentValidationSchema), addStudents);
router.post("/g", getStudents);
router.get("/", getStudent);
// router.put("/", updateStudents); // * not working
// router.delete("/", deleteStudents);
router.get("/feedback", checkStudentAuth, getFeedbackForStudent);
router.post("/feedback", checkStudentAuth, submitFeedbackForStudent);

module.exports = router;
