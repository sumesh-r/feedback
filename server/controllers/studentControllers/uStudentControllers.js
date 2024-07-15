const { Student } = require("../../models/Student.js");
const { tryCatch } = require("../../utils/tryCatch.js");

const updateStudent = async (req, res) => {
  /**
   * REQUIRED
   *  - req.regNo
   *  - req.updateData
   */
  let updateData = req.updateData;
  if (
    !/([0-2]{1}[0-9]{1}|3[0-1]{1})[/](0[1-9]|1[0-2])[/]([0-9]{4})/.test(
      updateData.dob
    )
  ) {
    return res
      .status(409)
      .json({ eMessage: "incorrect dob format" });
  }
  let student = await tryCatch(
    Student.updateOne({ regNo: req.regNo }, updateData)
  );
  if (student?.notOkay)
    return res.status(500).json(student?.error);
  return res
    .status(200)
    .json({ message: "Student updated" });
};

// main methods
const updateStudentForAdvisor = async (req, res) => {
  /**
   * BODY={
   *  regNo: 0,
   *  name: "",
   *  dob: ""
   * }
   *
   * STEPS:
   *    - checking if regNo exists
   *    - if yes update the student
   */
  const { regNo, name, dob } = req.body;
  let existingStudent, studentFilter, updateData;

  if (!regNo || !name || !dob) {
    return res
      .status(400)
      .json({ message: "need regNo name dob" });
  }
  studentFilter = {
    regNo: regNo,
    batch: req.batch,
    degree: req.degree,
    section: req.section,
  };

  // see if the register number already exists
  existingStudent = await tryCatch(
    Student.findOne(studentFilter)
  );
  if (existingStudent?.notOkay)
    return res.status(500).json(existingStudent?.error);

  updateData = {
    name: name.toUpperCase(),
    dob: dob,
  };

  if (!existingStudent) {
    return res
      .status(404)
      .json({ message: "Student does'nt exists" });
  }

  req.regNo = regNo;
  req.updateData = updateData;
  await updateStudent(req, res);
};

const updateStudentForAdmin = async (req, res) => {
  /**
   * BODY={
   *  regNo: 0,
   *  name: "",
   *  dob: ""
   * }
   *
   * STEPS:
   *    - checking if regNo exists
   *    - if yes update the student
   */
  const { regNo, name, dob } = req.body;
  let existingStudent, updateData;

  if (!regNo || !name || !dob) {
    return res
      .status(400)
      .json({ message: "need regNo name dob" });
  }

  // see if the register number already exists
  existingStudent = await tryCatch(
    Student.find({ regNo: regNo })
  );
  if (existingStudent?.notOkay)
    return res.status(500).json(existingStudent?.error);

  if (!existingStudent) {
    return res
      .status(404)
      .json({ message: "Student does'nt exists" });
  }
  updateData = {
    name: name.toUpperCase(),
    dob: dob,
  };

  req.regNo = regNo;
  req.updateData = updateData;

  await updateStudent(req, res);
};

module.exports = {
  updateStudentForAdvisor,
  updateStudentForAdmin,
};
