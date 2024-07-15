const { Student } = require("../../models/Student.js");
const { tryCatch } = require("../../utils/tryCatch.js");
const bcrypt = require("bcrypt");

// support methods
const addStudent = async (req, res) => {
  /**
   
    appropriate values will be provided in request by the method called.
   
    STEPS:
      - check the format of Date of birth (dd/mm/yyyy)
      - check if the regNo already exists
      - create the hashpassword
      - add the student to the db.
 */
  const { regNo, dob, password } = req.studentData;

  let student, studentData, hashPassword;

  if (
    !/([0-2]{1}[0-9]{1}|3[0-1]{1})[/](0[1-9]|1[0-2])[/]([0-9]{4})/.test(
      dob
    )
  ) {
    return res
      .status(409)
      .json({ eMessage: "incorrect dob format" });
  }

  student = await tryCatch(
    Student.findOne({ regNo: regNo })
  );
  if (student?.notOkay)
    return res.status(500).json(student?.error);

  if (student) {
    return res
      .status(409)
      .json({ message: "student already exists" });
  }

  hashPassword = await tryCatch(bcrypt.hash(password, 10));
  if (hashPassword?.notOkay)
    return res.status(500).json(hashPassword?.error);

  studentData = {
    regNo: req.studentData.regNo,
    name: req.studentData.name,
    dob: req.studentData.dob,
    batch: req.studentData.batch,
    degree: req.studentData.degree,
    section: req.studentData.section,
    password: hashPassword,
  };

  student = await tryCatch(Student(studentData).save());
  if (student?.notOkay)
    return res.status(500).json(student?.error);

  return res.status(200).json({ message: "student added" });
};

const addStudents = async (req, res) => {
  /**
   
    appropriate values will be provided in request by the method called.
   
    STEPS:
      - find the latest feedbackNo and assign the next roman value to the new feedback
      - create the feedback 
      - create the initial report
      - add the feedback details to the students profile.
 */

  return res
    .status(200)
    .json({ message: "feedback added successfully" });
};

// main methods
const addStudentForAdvisor = async (req, res) => {
  /**
    BODY= {
      regNo: 0,
      name: "",
      dob: "",
      password: "",
    }
    since the batch, degree and section will be taken from advisors profile while 
    authenticating these wont be needed to be in the body of the request.
   */

  if (
    !req.body.regNo ||
    !req.body.name ||
    !req.body.dob ||
    !req.body.password
  )
    return res
      .status(400)
      .json({ eMessage: "need regNo name dob password" });

  const studentData = {
    regNo: req.body.regNo,
    name: req.body.name.toUpperCase(),
    dob: req.body.dob,
    batch: req.batch,
    degree: req.degree.toUpperCase(),
    section: req.section.toUpperCase(),
    password: req.body.password,
  };

  req.studentData = studentData;

  await addStudent(req, res);
};

// !
const addStudentsForAdvisor = async (req, res) => {
  /**
    BODY= {
      semester: ""
    }
    since the batch, degree and section will be taken from advisors profile while 
    authenticating these wont be needed to be in the body of the request.
   */

  const studentsFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
  };

  const feedbackFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
  };

  const feedbackProjection = {
    feedbackNo: 1,
    _id: 0,
  };

  req.studentsFilter = studentsFilter;
  req.feedbackFilter = feedbackFilter;
  req.feedbackProjection = feedbackProjection;

  await addFeedback(req, res);
};

const addStudentForAdmin = async (req, res) => {
  /**
    BODY= {
      regNo: 0,
      name: "",
      dob: "",
      batch : 0,
      degree: "",
      section: "",
      password: "",
    }
   */

  if (
    !req.body.regNo ||
    !req.body.name ||
    !req.body.dob ||
    !req.body.password ||
    !req.body.batch ||
    !req.body.degree ||
    !req.body.section
  )
    return res
      .status(400)
      .json({
        eMessage:
          "need regNo name dob password batch degree section",
      });

  const studentData = {
    regNo: req.body.regNo,
    name: req.body.name.toUpperCase(),
    dob: req.body.dob,
    batch: req.body.batch,
    degree: req.body.degree.toUpperCase(),
    section: req.body.section.toUpperCase(),
    password: req.body.password,
  };

  req.studentData = studentData;

  await addStudent(req, res);
};

// !
const addStudentsForAdmin = async (req, res) => {
  /**
    BODY: {
      batch : 0,
      degree: "",
      section: "",
      semester: ""
    }
   */

  const feedbackFilter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    semester: req.body.semester,
  };

  const feedbackProjection = {
    feedbackNo: 1,
    _id: 0,
  };

  const studentsFilter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
  };

  req.studentsFilter = studentsFilter;
  req.feedbackFilter = feedbackFilter;
  req.feedbackProjection = feedbackProjection;

  await addFeedback(req, res);
};

module.exports = {
  addStudentForAdvisor,
  addStudentsForAdvisor, // won't work
  addStudentForAdmin,
  addStudentsForAdmin, // wont work
};
