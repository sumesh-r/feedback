const { Feedback } = require("#models/Feedback.js");
const { Report } = require("#models/Report.js");
const { Student } = require("#models/Student.js");
// for handle queries
const { tryCatch } = require("#utils/tryCatch.js");

// support methods
const deleteFeedback = async (req, res) => {
  /**
   
    appropriate values will be provided in request by the method called.
   
    STEPS:
      - check if feedback exists
      - delete the feedback 
      - delete the report
      - remove the feedback details from the students profile.
 */
  let feedback, students, report;

  const feedbackFilter = req.feedbackFilter;
  const studentsFilter = req.studentsFilter;

  //   checking if the feedback exists
  feedback = await tryCatch(Feedback.findOne(feedbackFilter));
  if (feedback?.notOkay) return res.status(500).json(feedback?.error);

  if (!feedback) {
    return res.status(409).json("feedback does'nt exists");
  }

  // deleting the feedback
  feedback = await tryCatch(await Feedback.deleteOne(feedbackFilter));
  if (feedback?.notOkay) return res.status(500).json(feedback?.error);

  //   deleting the respective report
  report = await tryCatch(await Report.deleteOne(feedbackFilter));
  if (report?.notOkay) return res.status(500).json(report?.error);

  //   removing feedback details from the students profile
  students = await tryCatch(
    Student.updateMany(studentsFilter, {
      $pull: {
        feedbacks: {
          semester: feedbackFilter.semester,
          feedbackNo: feedbackFilter.feedbackNo,
        },
      },
    })
  );
  if (students?.notOkay) return res.status(500).json(students?.error);

  return res.status(200).json({ message: "feedback deleted successfully" });
};

// main methods
const deleteFeedbackForAdvisor = async (req, res) => {
  /**
    BODY: {
      semester: "",
      feedbackNo: ""
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
    feedbackNo: req.body.feedbackNo,
  };

  req.studentsFilter = studentsFilter;
  req.feedbackFilter = feedbackFilter;

  await deleteFeedback(req, res);
};

const deleteFeedbackForAdmin = async (req, res) => {
  /**
    BODY: {
      batch : 0,
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

  const studentsFilter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
  };

  req.studentsFilter = studentsFilter;
  req.feedbackFilter = feedbackFilter;

  await deleteFeedback(req, res);
};

module.exports = {
  deleteFeedbackForAdvisor,
  deleteFeedbackForAdmin,
};
