const { Report } = require("../../models/Report.js");
const { Student } = require("../../models/Student.js");
// for handle queries
const { tryCatch } = require("../../utils/tryCatch.js");

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
    Report.findOne(
      reportFilter,
      "-_id -__v -updatedAt -createdAt"
    )
  );
  if (report?.notOkay)
    return res.status.json(report?.error);

  if (!report) {
    return res
      .status(409)
      .json({ message: "report doesn't exists" });
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
    Report.findOne(reportFilter, {
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
    })
  );
  if (report?.notOkay)
    return res.status(500).json(report?.error);

  let student = await tryCatch(
    Student.findOne(studentFilter)
  );
  if (student?.notOkay)
    return res.status(500).json(student?.error);
  let alreadySubmitted = false;

  student.feedbacks.map((feedback, idx) => {
    const isSubmitted =
      feedback["semester"] === reportFilter.semester &&
      feedback["feedbackNo"] === reportFilter.feedbackNo &&
      feedback["isSubmitted"] === true;
    if (isSubmitted) alreadySubmitted = true;
  });

  if (alreadySubmitted)
    return res
      .status(200)
      .json({ message: "no feedback to submit" });

  // const responseData = {
  //   ...reportFilter,
  //   subjects: subjects,
  // };

  // let response = await tryCatch(Response(responseData).save());
  // if (response?.notOkay) return res.status(500).json(response?.error);

  const updatedReport = {
    ...reportFilter,
    subjects: report.subjects.map((subject, idx) => {
      const data = subjects.find(
        (sub) => sub.subjectCode === subject.subjectCode
      );
      if (data) {
        if (subject.totalResponse === 0) {
          subject.subjectKnowledge = data.subjectKnowledge;
          subject.clearExplanation = data.clearExplanation;
          subject.usageOfTeachingTools =
            data.usageOfTeachingTools;
          subject.extraInput = data.extraInput;
          subject.teacherStudentRelationship =
            data.teacherStudentRelationship;
          subject.totalResponse = 1;
        } else {
          subject.subjectKnowledge =
            (subject.subjectKnowledge +
              data.subjectKnowledge) /
            2;
          subject.clearExplanation =
            (subject.clearExplanation +
              data.clearExplanation) /
            2;
          subject.usageOfTeachingTools =
            (subject.usageOfTeachingTools +
              data.usageOfTeachingTools) /
            2;
          subject.extraInput =
            (subject.extraInput + data.extraInput) / 2;
          subject.teacherStudentRelationship =
            (subject.teacherStudentRelationship +
              data.teacherStudentRelationship) /
            2;
          subject.totalResponse = subject.totalResponse + 1;
        }

        subject.averageTotal =
          (subject.subjectKnowledge +
            subject.clearExplanation +
            subject.usageOfTeachingTools +
            subject.extraInput +
            subject.teacherStudentRelationship) /
          5;

        subject.fourScaleRating =
          (subject.averageTotal / 10) * 4;
      }
      return subject;
    }),
  };

  report = await tryCatch(
    Report.updateOne(
      reportFilter,
      { $set: updatedReport },
      { upsert: true }
    )
  );
  if (report?.notOkay)
    return res.status(500).json(report?.error);

  student = await tryCatch(
    Student.updateOne(studentFilter, {
      $set: {
        "feedbacks.$.isSubmitted": true,
      },
    })
  );
  if (student?.notOkay)
    return res.status(500).json(student?.error);

  return res.status(200).json({
    message: "feedback Submitted",
  });
};

module.exports = {
  submitFeedbackForStudent,
};
