require("dotenv").config();
const { Staff } = require("../models/Staff");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Student } = require("../models/Student");
const { Feedback } = require("../models/Feedback");

const JWT_SECRET_KEY = process.env.JWT;
/* 
    This Controller can add user to the users 
    collection in the database
*/
const addStaff = async (req, res) => {
  const { userName, password } = req.body;

  let user;

  try {
    user = await Staff.findOne({ userName: userName });
    if (user) {
      return res.status(409).json({ message: "user already exists" });
    }
  } catch (error) {
    console.log(error);
  }
  let hashPassword;

  try {
    hashPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    return res.status(409).json({ message: "need password" });
  }

  try {
    user = await Staff({ ...req.body, password: hashPassword }).save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

/*  
    This Controller will send the data of the user whose user
    name is provided from the client
*/
const getUser = async (req, res) => {
  const cookies = req.headers.cookie;
  let prevToken = cookies;
  if (prevToken) {
    prevToken = prevToken.split("=")[1];
  }
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  // verifying the token
  jwt.verify(String(prevToken), JWT_SECRET_KEY, async (err, student) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    body = {
      _id: student.id,
    };

    let feedback = await Student.find(body);

    return res.status(200).json({ message: "Successfully got data", feedback });
  });
};

/* 
    this Controller can update user to the users 
    collection in the database
*/
const updateUser = async (req, res) => {
  let filter = {
    batch: req.body[0].batch,
    degree: req.body[0].degree,
    section: req.body[0].section,
  };

  let a = await Student.updateMany(filter, req.body);
  return res.status(500).json({ a: a });
};

/* 
    This Controller will delete the particular user
*/
const deleteUser = async (req, res) => {
  const { regNo } = req.body;

  if (!regNo) {
    return res.status(400).json({ message: "need regNo" });
  }

  // see if the userName already exists
  let existingStudent;
  try {
    existingStudent = await Student.find({ regNo: regNo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!existingStudent) {
    return res.status(404).json({ message: "Student does'nt exists" });
  }

  try {
    await Student.deleteOne({ regNo: regNo });
    return res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    console.log(error);
  }
};

const getDashboardDetailsForAdvisor = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
  };

  let students;
  let feedback;

  try {
    feedback = await Feedback.findOne(
      { ...filter, isLive: true },
      "-subjects -_id -__v"
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json({ message: "no feedbacks" });
  }

  try {
    students = await Student.find(
      filter,
      "isFeedbackSubmitted name regNo -_id"
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
  let feedbackNo = feedback.feedbackNo;
  let semester = feedback.semester;

  const notSubmittedStudents = students.map((student) => {
    if (
      student
      // !student.isFeedbackSubmitted[semester][feedbackNo]
      )
      return {
        name: student.name,
        regNo: student.regNo,
      };
  });

  if (!students[0]) {
    return res.status(409).json({ message: "no students" });
  }
  res.status(200).json({ notSubmittedStudents, feedback });
};

const getAdvisorsForAdmin = async (req, res) => {
  let staff;

  try {
    staff = await Staff.find({ role: "ADVISOR" }, "-_id -password -role");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!staff[0]) {
    return res.status(409).json({ message: "no staffs" });
  }
  res.status(200).json([...staff]);
};

const deleteAdvisorForAdmin = async (req, res) => {
  const { userName } = req.body;
  let staff;

  try {
    staff = await Staff.findOne({ userName: userName });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!staff) {
    return res.status(409).json({ eMessage: "staff does'nt exists" });
  }

  try {
    staff = await Staff.deleteOne({ userName: userName });
    return res.status(200).json("Staff Deleted");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const addAdvisorForAdmin = async (req, res) => {
  const { userName, password } = req.body;
  let staff;

  try {
    staff = await Staff.findOne({ userName: userName });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (staff) {
    return res.status(409).json({ eMessage: "staff already exists" });
  }

  let hashPassword;

  try {
    hashPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    return res.status(409).json({ message: "need password" });
  }

  try {
    staff = await Staff({
      ...req.body,
      role: "ADVISOR",
      password: hashPassword,
    }).save();
    return res.status(200).json("Staff Added");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateAdvisorForAdmin = async (req, res) => {
  const { userName } = req.body;
  let staff;

  try {
    staff = await Staff.findOne({ userName: userName });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!staff) {
    return res.status(409).json({ eMessage: "staff does'nt exists" });
  }

  try {
    staff = await Staff.updateOne({userName: userName}, {...req.body})
    return res.status(200).json("Staff Added");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  addStaff,
  getUser,
  updateUser,
  getDashboardDetailsForAdvisor,
  deleteUser,
  updateAdvisorForAdmin,
  getAdvisorsForAdmin,
  deleteAdvisorForAdmin,
  addAdvisorForAdmin,
};
