const { Student } = require("../../models/Student.js");
const { tryCatch } = require("../../utils/tryCatch.js");

const getStudent = async (req, res) => {
  /**
   * REQUIRED
   *  - req.studentFilter
   *  - req.studentProject
   */
  let student, studentFilter, studentProjection;
  studentFilter = req.studentFilter;
  studentProjection = req.studentProjection;
  student = await tryCatch(
    Student.findOne(studentFilter, studentProjection)
  );
  if (student?.notOkay)
    return res.status(500).json(student?.error);
  return res.status(200).json(student);
};

const getStudents = async (req, res) => {
  /**
   * REQUIRED
   *  - req.studentsFilter
   *  - req.studentsProjection
   */
  let students, studentsFilter, studentsProjection;
  studentsFilter = req.studentsFilter;
  studentsProjection = req.studentsProjection;
  students = await tryCatch(
    Student.find(studentsFilter, studentsProjection)
  );
  if (students?.notOkay)
    return res.status(500).json(students?.error);
  return res.status(200).json(students);
};

// main methods
const getStudentForAdvisor = async (req, res) => {
  /**
   * BODY={
   *  regNo: ""
   * }
   *
   * STEPS:
   *    - checking if regNo exists
   *    - if yes send the student
   */
  const { regNo } = req.body;
  let studentFilter, studentProjection;
  if (!regNo) {
    return res.status(400).json({ eMessage: "need regNo" });
  }
  studentFilter = {
    regNo: regNo,
    batch: req.batch,
    degree: req.degree,
    section: req.section,
  };
  studentProjection = {
    _id: 0,
    regNo: 1,
    name: 1,
    dob: 1,
  };
  req.studentFilter = studentFilter;
  req.studentProjection = studentProjection;
  await getStudent(req, res);
};
const getStudentsForAdvisor = async (req, res) => {
  /**
   * BODY={}
   */
  let studentsFilter, studentsProjection;

  studentsFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
  };

  studentsProjection = {
    _id: 0,
    regNo: 1,
    name: 1,
    dob: 1,
    degree: 1,
    batch: 1,
    section: 1,
  };

  req.studentsFilter = studentsFilter;
  req.studentsProjection = studentsProjection;
  await getStudents(req, res);
};

const getStudentForAdmin = async (req, res) => {
  /**
   * BODY={
   *  regNo: ""
   * }
   *
   * STEPS:
   *    - checking if regNo exists
   *    - if yes delte the student
   */
  const { regNo } = req.body;
  let studentFilter, studentProjection;

  if (!regNo) {
    return res.status(400).json({ message: "need regNo" });
  }
  studentFilter = {
    regNo: regNo,
  };
  studentProjection = {
    _id: 0,
    password: 0,
    feedbacks: 0,
  };
  req.studentFilter = studentFilter;
  req.studentProjection = studentProjection;
  await getStudent(req, res);
};
const getStudentsForAdmin = async (req, res) => {
  /**
   * BODY={
   *  batch: "",
   *  degree: "",
   *  semester: ""
   * }
   *
   * STEPS:
   *    - checking if regNo exists
   *    - if yes delte the student
   */
  const { batch, degree, section } = req.body;
  let studentsFilter, studentsProjection;

  if (!batch || !degree || !section) {
    return res
      .status(400)
      .json({ message: "need batch degree section" });
  }

  studentsFilter = {
    batch: batch,
    degree: degree,
    section: section,
  };
  studentsProjection = {
    _id: 0,
    password: 0,
    feedbacks: 0,
  };

  req.studentsFilter = studentsFilter;
  req.studentsProjection = studentsProjection;
  await getStudents(req, res);
};

// method only for development purpose
const getAllStudentsForAdmin = async (req, res) => {
  let students;

  try {
    students = await Student.find({}, "-password");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!students[0]) {
    return res.status(409).json({ message: "no students" });
  }
  res.status(200).json([...students]);
};

module.exports = {
  getStudentForAdvisor,
  getStudentsForAdvisor,
  getStudentForAdmin,
  getStudentsForAdmin,
};
