const router = require("express").Router();
const { checkAdminAuth } = require("#middlewares/checkAuth.js");
const {
  getFeedbacksForAdmin,
} = require("../controllers/feedback-controller.js");

// admin
router.get("/a/feedbacks", checkAdminAuth, getFeedbacksForAdmin);

module.exports = router;
