const { Student } = require("../models/Student");
const { Staff } = require("../models/Staff");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT;
const IS_DEVELOPMENT =
  process.env.IS_DEVELOPMENT === "true";

let secureAndSameSite = {};

if (!IS_DEVELOPMENT) {
  secureAndSameSite = {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
  };
}

// * this function will run when a student tries to login
const studentLogin = async (req, res) => {
  const { regNo, dob, password } = req.body;

  // * checking if all three values are available
  if (!regNo || !dob || !password) {
    return res.status(400).json({
      eMessage:
        "need register number, date of birth and password",
      path: "student",
    });
  }

  // * find the student if available
  let student;
  try {
    student = await Student.findOne({ regNo: regNo });
  } catch (err) {
    return new Error(err);
  }
  if (!student) {
    return res.status(404).json({
      eMessage: "user not found",
      path: "student",
    });
  }

  // * Check if the dob and password are correct
  const isDobCorrect = dob === student.dob;
  const isPasswordCorrect = bcrypt.compareSync(
    password,
    student.password
  );

  if (!isPasswordCorrect || !isDobCorrect) {
    return res.status(401).json({
      eMessage: "Invalid Credential",
      path: "student",
    });
  }

  // * Generating Token
  const accessToken = jwt.sign(
    { id: student.regNo },
    JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );

  // Create secure cookie with refresh token
  res.cookie("token", accessToken, {
    ...secureAndSameSite,
    maxAge: 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // * data that has to be sent minimum
  let studentData = {
    name: student.name,
    regNo: student.regNo,
    batch: student.batch,
    degree: student.degree,
    section: student.section,
  };

  return res.status(200).json({ ...studentData });
};

const studentLogout = async (req, res) => {
  // * Checking if token exists and Getting the token from cookie
  res.clearCookie("token").json({ message: "logged out" });
};

const staffLogin = async (req, res) => {
  const { userName, password } = req.body;

  console.log(req.body);

  // * checking if all three values are available
  if (!userName || !password) {
    return res.status(401).json({
      eMessage: "need userName and password",
      path: "staff",
    });
  }

  // * find the student if available
  let staff;
  try {
    staff = await Staff.findOne({ userName: userName });
  } catch (err) {
    return new Error(err);
  }

  if (!staff) {
    return res
      .status(404)
      .json({ eMessage: "user not found", path: "staff" });
  }

  // * Check if the password are correct
  const isPasswordCorrect = bcrypt.compareSync(
    password,
    staff.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({
      eMessage: "Invalid Credential",
      path: "staff",
    });
  }

  // * Generating Token
  const accessToken = jwt.sign(
    { id: String(staff.userName) },
    JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );

  // Create secure cookie with refresh token
  res.cookie("token", accessToken, {
    ...secureAndSameSite,
    maxAge: 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // * Defining the data which has to be return to the user
  let userData = {
    userName: staff.userName,
    role: staff.role,
    batch: staff.batch,
    degree: staff.degree,
    section: staff.section,
  };

  return res.status(200).json({ ...userData });
};

const staffLogout = async (req, res) => {
  // * Checking if token exists and Getting the token from cookie

  res.clearCookie("token").json({ message: "logged out" });
};

module.exports = {
  studentLogin,
  studentLogout,
  staffLogin,
  staffLogout,
};
