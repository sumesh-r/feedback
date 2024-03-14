const { Feedback } = require("#models/Feedback.js");
const { Student } = require("#models/Student.js");
// for handle queries
const { tryCatch } = require("#utils/tryCatch.js");

// support methods
const getFeedback = async (req, res) => {
  /**
    appropriate values will be provided in request by the method called.

    REQUIRED:
      - req.feedbackFilter
   
    STEPS:
      - get the feedback filter
      - fetch the feedback
      - return the feedback
 */
  let feedback;
  const feedbackFilter = req.feedbackFilter;

  feedback = await tryCatch(
    Feedback.findOne(feedbackFilter, "-_id -__v -updatedAt -createdAt")
  );
  if (feedback?.notOkay) return res.status.json(feedback?.error);

  if (!feedback) {
    return res.status(409).json({ message: "feedback doesn't exists" });
  }

  return res.status(200).json(feedback);
};

const getFeedbacks = async (req, res) => {
  /**
    appropriate values will be provided in request by the method called.

    REQUIRED:
      - req.feedbacksFilter
   
    STEPS:
      - get the feedbacks filter
      - fetch the feedbacks
      - return the feedbacks
 */
  let feedbacks;
  const feedbacksFilter = req.feedbacksFilter;

  feedbacks = await tryCatch(
    Feedback.find(
      feedbacksFilter,
      "-_id -__v -createdAt -updatedAt -subjects -electiveSubjects"
    )
  );
  if (feedbacks?.notOkay) return res.status.json(feedbacks?.error);

  if (!feedbacks[0]) {
    return res.status(409).json([{ message: "feedbacks doesn't exists" }]);
  }

  return res.status(200).json(feedbacks);
};

// main methods
const getFeedbackForAdvisor = async (req, res) => {
  /**
   BODY = {
    semester: "",
    feedbackNo: ""
   }
   */
  const feedbackFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  req.feedbackFilter = feedbackFilter;

  await getFeedback(req, res);
};

const getFeedbacksForAdvisor = async (req, res) => {
  /**
   BODY = {}
   */
  const feedbacksFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
  };

  req.feedbacksFilter = feedbacksFilter;

  await getFeedbacks(req, res);
};

const getFeedbackForAdmin = async (req, res) => {
  /**
   BODY = {
    batch: 0,
    degree: "",
    section: "",
    semester: "",
    feedbackNo: ""
   }
   */
  const feedbackFilter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  req.feedbackFilter = feedbackFilter;

  await getFeedback(req, res);
};

const getFeedbacksForAdmin = async (req, res) => {
  /**
   BODY = {}
   */
  const feedbacksFilter = {};

  req.feedbacksFilter = feedbacksFilter;

  await getFeedbacks(req, res);
};

const getFeedbackForStudent = async (req, res) => {
  /**
   BODY = {}
   */
  let feedbackFilter, feedback, studentFilter, student, electiveSubjects;
  feedbackFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    isLive: true,
  };

  feedback = await tryCatch(
    Feedback.findOne(feedbackFilter, "-_id -__v -updatedAt -createdAt")
  );
  if (feedback?.notOkay) return res.status.json(feedback?.error);

  if (!feedback) {
    return res.status(409).json({ message: "feedback doesn't exists" });
  }

  studentFilter = {
    regNo: req.regNo,
    "feedbacks.semester": feedback.semester,
    "feedbacks.feedbackNo": feedback.feedbackNo,
  };

  student = await tryCatch(
    Student.findOne(studentFilter, { feedbacks: 1, _id: 0 })
  );
  if (student.feedbacks[0].isSubmitted)
    return res.status(200).json({ message: "no feedback to submit" });
  // const data = subjects.find(
  //   (sub) => sub.subjectCode === subject.subjectCode
  // );
  electiveSubjects = feedback.electiveSubjects.find(
    (electiveSubject) => electiveSubject.regNo === req.regNo
  );

  feedback.electiveSubjects = electiveSubjects;

  return res.status(200).json(feedback);
};

const getDashboardDetailsForAdvisor = async (req, res) => {
  /**
   * BODY={}
   */
  // Define variables
  let feedback,
    studentsFilter,
    notSubmittedStudents,
    feedbackFilter,
    studentsProjection;

  // Filters to fetch from db
  feedbackFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    isLive: true,
  };

  // get the live feedback
  feedback = await tryCatch(
    Feedback.findOne(feedbackFilter, "-subjects -_id -__v")
  );
  if (feedback?.notOkay) return res.status(500).json(feedback?.error);

  if (!feedback) {
    return res.status(200).json({ message: "there is no live feedback" });
  }

  studentsFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    "feedbacks.semester": feedback.semester,
    "feedbacks.feedbackNo": feedback.feedbackNo,
    "feedbacks.isSubmitted": false,
  };
  studentsProjection = {
    regNo: 1,
    name: 1,
    _id: 0,
  };

  // get the list of students who have not submitted the feedback
  notSubmittedStudents = await tryCatch(
    Student.find(studentsFilter, studentsProjection).sort({ regNo: 1 })
  );
  if (notSubmittedStudents?.notOkay)
    return res.status(500).json(notSubmittedStudents?.error);
  if (!notSubmittedStudents[0]) {
    return res.status(200).json({ message: "no students" });
  }
  // return the list of not submittedStudents and the live feedback
  return res.status(200).json({ notSubmittedStudents, feedback });
};

module.exports = {
  getFeedbackForAdvisor,
  getFeedbacksForAdvisor,
  getFeedbackForAdmin,
  getFeedbacksForAdmin,
  getFeedbackForStudent,
  getDashboardDetailsForAdvisor,
};
