const router = require("express").Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  studentLogin,
  studentLogout,
  staffLogin,
  staffLogout,
} = require("../controllers/auth-controller.js");

router.post("/student/login", studentLogin);
router.post("/student/logout", studentLogout);
router.post("/staff/login", staffLogin);
router.post("/staff/logout", staffLogout);

module.exports = router;
