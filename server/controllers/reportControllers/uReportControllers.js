const { Report } = require("#models/Report.js");
const { Response } = require("#models/Response.js");
const { Student } = require("#models/Student.js");
// for handle queries
const { tryCatch } = require("#utils/tryCatch.js");

// support methods
const getReport = async (req, res) => {
  /**
    appropriate values will be provided in request by the method called.

    REQUIRED:
      - req.reportFilter
   
    STEPS:
      - get the report filter
      - fetch the report
      - return the report
 */
  let report;
  const reportFilter = req.reportFilter;

  report = await tryCatch(
    Report.findOne(reportFilter, "-_id -__v -updatedAt -createdAt")
  );
  if (report?.notOkay) return res.status.json(report?.error);

  if (!report) {
    return res.status(409).json({ message: "report doesn't exists" });
  }

  return res.status(200).json(report);
};

// main methods
const submitFeedbackForStudent = async (req, res) => {
  /**
   BODY = {
      batch: 0,
      degree: "",
      semester: "",
      section: "",
      feedbackNo: "",
      subjects: [],
   }

   actually the data is stored in the reports
   */
  let reportFilter, subjects, report;

  reportFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };
  subjects = req.body.subjects;
  const studentFilter = {
    regNo: req.regNo,
    "feedbacks.semester": reportFilter.semester,
    "feedbacks.feedbackNo": reportFilter.feedbackNo,
  };

  report = await tryCatch(
    Report.findOne(reportFilter, { _id: 0, createdAt: 0, updatedAt: 0 })
  );
  if (report?.notOkay) return res.status(500).json(report?.error);

  let student = await tryCatch(Student.findOne(studentFilter));
  if (student?.notOkay) return res.status(500).json(student?.error);
  let alreadySubmitted = false;

  student.feedbacks.map((feedback, idx) => {
    const isSubmitted =
      feedback["semester"] === reportFilter.semester &&
      feedback["feedbackNo"] === reportFilter.feedbackNo &&
      feedback["isSubmitted"] === true;
    if (isSubmitted) alreadySubmitted = true;
  });

  if (alreadySubmitted) return res.status(200).json({message:"no feedback to submit"});

  const responseData = {
    ...reportFilter,
    subjects: subjects,
  };

  let response = await tryCatch(Response(responseData).save());
  if (response?.notOkay) return res.status(500).json(response?.error);

  student = await tryCatch(
    Student.updateOne(studentFilter, {
      $set: {
        "feedbacks.$.isSubmitted": true,
      },
    })
  );
  if (student?.notOkay) return res.status(500).json(student?.error);

  return res.status(200).json({ message: "feedback Submitted" });
};

module.exports = {
  submitFeedbackForStudent,
};
