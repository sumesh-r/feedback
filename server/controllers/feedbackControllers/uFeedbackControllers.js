const { Feedback } = require("../../models/Feedback.js");
const { Report } = require("../../models/Report.js");
const { Student } = require("../../models/Student.js");
// for handle queries
const { tryCatch } = require("../../utils/tryCatch.js");

// support methods
// this method will get a array subjects and return list of how many times a id is repeated
const countBy = (d, id) =>
  d.reduce(
    (r, { subjectCode }, i, a) => (
      (r[subjectCode] = a.filter(
        (x) => x.subjectCode == subjectCode
      ).length),
      r
    ),
    {}
  );

// method to remove duplicate in an array
const removeDuplicate = (arr, filter) => {
  // Declare a new array
  let newArray = [];
  // Declare an empty object
  let uniqueObject = {};
  // Loop for the array elements
  for (let i in arr) {
    // Extract the title
    objTitle = arr[i][filter];
    // Use the title as the index
    uniqueObject[objTitle] = arr[i];
  }
  // Loop to push unique object into array
  for (i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }
  // Display the unique objects
  return newArray;
};

const updateFeedback = async (req, res) => {
  /**
    appropriate values will be provided in request by the method called.

    REQUIRED:
      - req.isLiveFilter
      - req.feedbackFilter
      - req.studentsFilter
   
    STEPS:
      - define the variables containing the values to be updated
      - assign the values by following the conditions
        - changing in isLive should be handled properly
      - update the feedback
      - created the required fields for report like totalStudents etc...
      - update the report
 */
  let isLiveFeedback,
    feedback,
    report,
    studentCount,
    updateData,
    subjectsForFeedback,
    updateElectiveSubjectsData,
    isSameFeedback,
    isSameIsLive,
    electiveSubjectCounts,
    uniqueElectiveSubjects,
    subjectsForReport,
    electiveSubjectsForReport,
    electiveSubjectsForFeedback;

  let isIsLiveChangedTofalse = false;

  const isLiveFilter = req.isLiveFilter;
  const feedbackFilter = req.feedbackFilter;
  const studentsFilter = req.studentsFilter;

  // data to be updated
  updateData = {
    isLive: req.body.isLive,
  };
  subjectsForFeedback = [...req.body.subjects];
  electiveSubjectsForFeedback = [
    ...req.body.electiveSubjects,
  ];
  // used to change the structure of elective subjects to fit with report
  updateElectiveSubjectsData = [
    ...req.body.electiveSubjects,
  ];

  // get the required details from db
  feedback = await tryCatch(
    Feedback.findOne(feedbackFilter)
  );
  if (feedback?.notOkay)
    return res.status(500).json(feedback?.error);

  isLiveFeedback = await tryCatch(
    Feedback.findOne(isLiveFilter)
  );
  if (isLiveFeedback?.notOkay)
    return res.status(500).json(isLiveFeedback?.error);

  report = await tryCatch(Report.findOne(feedbackFilter));
  if (report?.notOkay)
    return res.status(500).json(report?.error);

  studentCount = await tryCatch(
    Student.find(studentsFilter).count()
  );
  if (studentCount?.notOkay)
    return res.status(500).json(studentCount?.error);

  // checking all data required exists in db
  if (
    !feedback ||
    !report ||
    studentCount === 0 ||
    studentCount === null
  ) {
    return res.status(409).json("feedback doesn't exists");
  }

  // checking if there is another feedback is live
  if (isLiveFeedback) {
    isSameFeedback =
      feedback.semester === isLiveFeedback.semester &&
      feedback.feedbackNo === isLiveFeedback.feedbackNo;

    isSameIsLive =
      updateData.isLive === isLiveFeedback.isLive;
  }

  if (updateData.isLive)
    if (!isSameFeedback && isSameIsLive) {
      isIsLiveChangedTofalse = true;
      updateData.isLive = false;
    }

  // update feedback
  feedback = await tryCatch(
    Feedback.updateOne(feedbackFilter, {
      $set: {
        isLive: updateData.isLive,
        subjects: subjectsForFeedback,
        electiveSubjects: electiveSubjectsForFeedback,
      },
    })
  );
  if (feedback?.notOkay)
    return res.status(500).json(feedback?.error);

  // data for report
  subjectsForReport = subjectsForFeedback.map(
    (subject, idx) => {
      return {
        ...subject,
        totalStrength: studentCount,
      };
    }
  );
  electiveSubjectCounts = countBy(
    updateElectiveSubjectsData,
    "subjectCode"
  );
  uniqueElectiveSubjects = removeDuplicate(
    updateElectiveSubjectsData,
    "subjectCode"
  );

  electiveSubjectsForReport = uniqueElectiveSubjects.map(
    (subject, idx) => {
      delete subject["regNo"];
      return {
        ...subject,
        totalStrength:
          electiveSubjectCounts[
            String(subject.subjectCode)
          ],
      };
    }
  );

  // update report
  report = await tryCatch(
    Report.updateOne(feedbackFilter, {
      $set: {
        subjects: [
          ...subjectsForReport,
          ...electiveSubjectsForReport,
        ],
      },
    })
  );
  if (report?.notOkay)
    return res.status(500).json(report?.error);

  if (isIsLiveChangedTofalse)
    return res.status(200).json({
      message:
        "another feedback is active so this feedback cannot be activated and other details have been updated",
    });

  return res
    .status(200)
    .json({ message: "feedback updated successfully" });
};

// main methods
const updateFeedbackForAdvisor = async (req, res) => {
  /**
    BODY = {
      "semester": "",
      "feedbackNo" : "",
      "subjects": [],
      "electiveSubjects": []
    }
  */
  if (
    !req.body.subjects ||
    !req.body.electiveSubjects ||
    !req.body.isLive.toString() ||
    !req.body.semester ||
    !req.body.feedbackNo
  )
    return res
      .status(400)
      .json({ eMessage: "need more data" });

  const feedbackfilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  const isLiveFilter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    isLive: true,
  };

  const studentsFilter = {
    batch: feedbackfilter.batch,
    degree: feedbackfilter.degree,
    section: feedbackfilter.section,
  };

  req.feedbackFilter = feedbackfilter;
  req.studentsFilter = studentsFilter;
  req.isLiveFilter = isLiveFilter;

  await updateFeedback(req, res);
};

const updateFeedbackForAdmin = async (req, res) => {
  /**
    BODY = {
      "batch": 0,
      "degree": "",
      "section": "",
      "semester": "",
      "feedbackNo" : "",
      "subjects": [],
      "electiveSubjects": []
    }
  */
  if (
    !req.body.subjects ||
    !req.body.electiveSubjects ||
    !req.body.isLive.toString() ||
    !req.body.batch ||
    !req.body.degree ||
    !req.body.section ||
    !req.body.semester ||
    !req.body.feedbackNo
  )
    return res
      .status(400)
      .json({ eMessage: "need more data" });

  const feedbackfilter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  const isLiveFilter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    isLive: true,
  };

  const studentsFilter = {
    batch: feedbackfilter.batch,
    degree: feedbackfilter.degree,
    section: feedbackfilter.section,
  };

  req.feedbackFilter = feedbackfilter;
  req.studentsFilter = studentsFilter;
  req.isLiveFilter = isLiveFilter;

  await updateFeedback(req, res);
};

module.exports = {
  updateFeedbackForAdvisor,
  updateFeedbackForAdmin,
};
