const router = require("express").Router();
const {
  addStaff,
  getUser,
  updateUser,
  deleteUser,
  getDashboardDetailsForAdvisor,
  getAdvisorsForAdmin,
  deleteAdvisorForAdmin,
  updateAdvisorForAdmin,
  addAdvisorForAdmin,
} = require("../controllers/staff-controller.js");
const userValidationSchema = require("#validation/staff-validation.js");
const validateData = require("#middlewares/validateData.js");
const { checkAdminAuth, checkStaffAuth } = require("#middlewares/checkAuth.js");
const {
  getFeedbacksForAdvisor,
  getFeedbackForAdvisor,
  getFeedbacksForAdmin,
  getFeedbackForAdmin,
  deleteFeedbackForAdmin,
} = require("../controllers/feedback-controller.js");
const {
  getStudentsForAdvisor,
  getStudentsForAdmin,
  getAllStudentsForAdmin,
  deleteStudent,
  addStudentForAdvisor,
  addStudentForAdmin,
  updateStudentForAdvisor,
  updateStudentForAdmin,
} = require("../controllers/student-controller");

router.post("/", validateData(userValidationSchema), addStaff);
router.get("/feedbacks", checkStaffAuth, getFeedbacksForAdvisor);
router.post("/feedback", checkStaffAuth, getFeedbackForAdvisor);
router.get("/students", checkStaffAuth, getStudentsForAdvisor);
router.get("/dashboard", checkStaffAuth, getDashboardDetailsForAdvisor);
router.post("/student", checkStaffAuth, addStudentForAdvisor);
router.post("/student/update", checkStaffAuth, updateStudentForAdvisor);
router.post("/student/delete", checkStaffAuth, deleteStudent);

// admin
router.post("/a/student", checkAdminAuth, addStudentForAdmin);
router.post("/a/student/update", checkAdminAuth, updateStudentForAdmin); 
router.get("/a/feedbacks", checkAdminAuth, getFeedbacksForAdmin);
router.post("/a/feedback", checkAdminAuth, getFeedbackForAdmin); 
router.get("/ab/students", checkAdminAuth, getAllStudentsForAdmin); // not used in client
router.post("/a/students", checkAdminAuth, getStudentsForAdmin);
router.get("/a/advisors", checkAdminAuth, getAdvisorsForAdmin);
router.post("/a/advisor", checkAdminAuth, addAdvisorForAdmin);
router.post("/a/advisor/update", checkAdminAuth, updateAdvisorForAdmin);
router.post("/a/advisor/delete", checkAdminAuth, deleteAdvisorForAdmin);
router.post("/a/student/delete", checkAdminAuth, deleteStudent);
router.post("/a/feedback/delete", checkAdminAuth, deleteFeedbackForAdmin);

module.exports = router;
