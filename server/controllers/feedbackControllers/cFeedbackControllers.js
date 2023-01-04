const { Feedback } = require("#models/Feedback.js");
const { Report } = require("#models/Report.js");
const { Student } = require("#models/Student.js");
// to create and convert feedbackNo in feedbacks
const { romanize, roman_to_Int } = require("#utils/romans.js");
// for handle queries
const { tryCatch } = require("#utils/tryCatch.js");

// support methods
const addFeedback = async (req, res) => {
  /**
   
    appropriate values will be provided in request by the method called.
   
    STEPS:
      - find the latest feedbackNo and assign the next roman value to the new feedback
      - create the feedback 
      - create the initial report
      - add the feedback details to the students profile.
 */
  let feedbackNo, feedback, students, report, count, latestFeedback;

  const feedbackFilter = req.feedbackFilter;
  const feedbackProjection = req.feedbackProjection;
  const studentsFilter = req.studentsFilter;

  // find the lastest feedbackNo
  latestFeedback = await tryCatch(
    Feedback.findOne(feedbackFilter, feedbackProjection)
      .sort({ createdAt: -1 })
      .limit(1)
  );
  if (latestFeedback?.notOkay)
    return res.status(500).json(latestFeedback?.error);

  if (!latestFeedback) {
    count = 0;
  } else {
    count = roman_to_Int(latestFeedback.feedbackNo);
  }
  feedbackNo = romanize(count + 1);

  // create feedback
  feedback = await tryCatch(
    Feedback({
      ...feedbackFilter,
      feedbackNo: feedbackNo,
    }).save()
  );
  if (feedback?.notOkay) return res.status(500).json(feedback?.error);

  // create report
  report = await tryCatch(
    Report({
      ...feedbackFilter,
      feedbackNo: feedbackNo,
    }).save()
  );
  if (report?.notOkay) return res.status(500).json(report?.error);

  // add the feedback detail to students's profiles
  students = await tryCatch(
    Student.updateMany(studentsFilter, {
      $set: {
        feedbacks: {
          semester: feedbackFilter.semester,
          feedbackNo: feedbackNo,
        },
      },
    })
  );
  if (students?.notOkay) return res.status(500).json(students?.error);

  return res.status(200).json({ message: "feedback added successfully" });
};

// main methods
const addFeedbackForAdvisor = async (req, res) => {
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

const addFeedbackForAdmin = async (req, res) => {
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
  addFeedbackForAdvisor,
  addFeedbackForAdmin,
};
