const { Student } = require("#models/Student.js");
const { tryCatch } = require("#utils/tryCatch.js");

const deleteStudent = async (req, res) => {
  /**
   * REQUIRED
   *  - req.regNo
   */
  let student = await tryCatch(Student.deleteOne({ regNo: req.regNo }));
  if (student?.notOkay) return res.status(500).json(student?.error);
  return res.status(200).json({ message: "Student Deleted" });
};

// main methods
const deleteStudentForAdvisor = async (req, res) => {
  /**
   * BODY={
   *  regNo: ""
   * }
   *
   * STEPS:
   *    - checking if regNo exists
   *    - if yes delete the student
   */
  const { regNo } = req.body;
  let existingStudent, studentFilter;

  if (!regNo) {
    return res.status(400).json({ message: "need regNo" });
  }
  studentFilter = {
    regNo: regNo,
    batch: req.batch,
    degree: req.degree,
    section: req.section,
  };

  // see if the register number already exists
  existingStudent = await tryCatch(Student.findOne(studentFilter));
  if (existingStudent?.notOkay)
    return res.status(500).json(existingStudent?.error);


  if (!existingStudent) {
    return res.status(404).json({ message: "Student does'nt exists" });
  }

  req.regNo = regNo;
  await deleteStudent(req, res);
};

const deleteStudentForAdmin = async (req, res) => {
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
  let existingStudent;

  if (!regNo) {
    return res.status(400).json({ message: "need regNo" });
  }

  // see if the register number already exists
  existingStudent = await tryCatch(Student.find({ regNo: regNo }));
  if (existingStudent?.notOkay)
    return res.status(500).json(existingStudent?.error);

  if (!existingStudent) {
    return res.status(404).json({ message: "Student does'nt exists" });
  }
  req.regNo = regNo;
  await deleteStudent(req, res);
};

module.exports = {
  deleteStudentForAdvisor,
  deleteStudentForAdmin,
};
