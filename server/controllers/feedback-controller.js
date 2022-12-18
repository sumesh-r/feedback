const { Feedback } = require("../models/Feedback");
const { Student } = require("../models/Student");

const addFeedback = async (req, res) => {
  function romanize(num) {
    if (isNaN(num)) return NaN;
    var digits = String(+num).split(""),
      key = [
        "",
        "C",
        "CC",
        "CCC",
        "CD",
        "D",
        "DC",
        "DCC",
        "DCCC",
        "CM",
        "",
        "X",
        "XX",
        "XXX",
        "XL",
        "L",
        "LX",
        "LXX",
        "LXXX",
        "XC",
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
      ],
      roman = "",
      i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }
  function roman_to_Int(str1) {
    if (str1 == null) return -1;
    var num = char_to_int(str1.charAt(0));
    var pre, curr;

    for (var i = 1; i < str1.length; i++) {
      curr = char_to_int(str1.charAt(i));
      pre = char_to_int(str1.charAt(i - 1));
      if (curr <= pre) {
        num += curr;
      } else {
        num = num - pre * 2 + curr;
      }
    }

    return num;
  }
  function char_to_int(c) {
    switch (c) {
      case "I":
        return 1;
      case "V":
        return 5;
      case "X":
        return 10;
      case "L":
        return 50;
      case "C":
        return 100;
      case "D":
        return 500;
      case "M":
        return 1000;
      default:
        return -1;
    }
  }
  const filter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    semester: req.body.semester,
  };

  // db.Member.find({ country_id: 10 }).sort({ score: -1 }).limit(1);

  let latestFeedback = await Feedback.findOne(
    {
      ...filter,
    },
    { feedbackNo: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .limit(1);
  let count;
  if (!latestFeedback) {
    count = 0;
  } else {
    count = roman_to_Int(latestFeedback.feedbackNo);
  }
  let feedbackNo = romanize(count + 1);

  let feedback, students;

  try {
    feedback = await Feedback.findOne({
      ...filter,
      feedbackNo: feedbackNo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (feedback) {
    return res.status(409).json({ eMessage: "feedback already exists" });
  }

  try {
    feedback = await Feedback({
      ...req.body,
      feedbackNo: feedbackNo,
    }).save();
    students = await Student.updateMany(filter, {
      $addToSet: {
        feedbacks: {
          semester: filter.semester,
          feedbackNo: feedbackNo,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ message: "feedback added successfully" });
};

const deleteFeedback = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  let feedback, students;

  try {
    feedback = await Feedback.findOne({
      ...filter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json("feedback does'nt exists");
  }

  try {
    feedback = await Feedback.deleteOne({
      ...req.body,
    });
    students = await Student.updateMany(filter, {
      $pull: {
        feedbacks: {
          semester: filter.semester,
          feedbackNo: req.body.feedbackNo,
        },
      },
    });
    console.log(students);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ message: "feedback deleted successfully" });
};

const deleteFeedbackForAdmin = async (req, res) => {
  const filter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  let feedback, students;

  try {
    feedback = await Feedback.findOne({
      ...filter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json("feedback does'nt exists");
  }

  try {
    feedback = await Feedback.deleteOne({
      ...req.body,
    });
    students = await Student.updateMany(filter, {
      $pull: {
        feedbacks: {
          semester: filter.semester,
          feedbackNo: req.body.feedbackNo,
        },
      },
    });
    console.log(students);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ message: "feedback deleted successfully" });
};

const addFeedbackSubject = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body[0].semester,
    feedbackNo: req.body[0].feedbackNo,
  };
  const subjectData = req.body;
  let feedback;

  try {
    feedback = await Feedback.bulkWrite(
      subjectData.map((data) => ({
        updateOne: {
          filter: filter,
          update: {
            $addToSet: {
              subjects: {
                subjectCode: data.subjectCode,
                subjectName: data.subjectName,
                faculty: data.faculty,
                facultyDepartment: data.facultyDepartment,
                facultyPosition: data.facultyPosition,
              },
            },
          },
        },
      }))
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res
    .status(200)
    .json({ message: `${feedback.nModified} subjects added successfully` });
};

const updateFeedbackSubject = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  const updateData = {
    subjectCode: req.body.subjectCode,
    subjectName: req.body.subjectName,
    faculty: req.body.faculty,
    facultyPosition: req.body.facultyPosition,
    facultyDepartment: req.body.facultyDepartment,
  };

  let feedback;

  try {
    feedback = await Feedback.findOne({
      ...filter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json("feedback does'nt exists");
  }
  try {
    feedback = await Feedback.updateOne(
      {
        ...filter,
        "subjects.subjectCode": updateData.subjectCode,
      },
      {
        $set: {
          "subjects.$.subjectName": updateData.subjectName,
          "subjects.$.faculty": updateData.faculty,
          "subjects.$.facultyPosition": updateData.facultyPosition,
          "subjects.$.facultyDepartment": updateData.facultyDepartment,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ message: "feedback updated successfully" });
};

const deleteFeedbackSubject = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };
  const data = {
    subjectCode: req.body.subjectCode,
    subjectName: req.body.subjectName,
    faculty: req.body.faculty,
    facultyDepartment: req.body.facultyDepartment,
    facultyPosition: req.body.facultyPosition,
  };

  let feedback;

  try {
    feedback = await Feedback.findOne({
      ...filter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json("feedback does'nt exists");
  }
  try {
    feedback = await Feedback.updateOne(
      {
        ...filter,
      },
      {
        $pull: {
          subjects: {
            subjectCode: data.subjectCode,
            subjectName: data.subjectName,
            faculty: data.faculty,
            facultyDepartment: data.facultyDepartment,
            facultyPosition: data.facultyPosition,
          },
        },
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ eMessage: error });
  }

  return res.status(200).json({ message: "feedback updated successfully" });
};

const getFeedbacksForAdvisor = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
  };

  let feedbacks;

  try {
    feedbacks = await Feedback.find(
      { filter },
      "-subjects -electiveSubjects -_id -__v -createAt -updatedAt"
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedbacks[0]) {
    return res.status(409).json({ message: "no feedbacks" });
  }

  res.status(200).json({ feedbacks });
};

const getFeedbackForAdvisor = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  let feedback;
  try {
    feedback = await Feedback.findOne(filter, "-_id -__v");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json({ message: "feedback doesn't exists" });
  }

  res.status(200).json(feedback);
};

const getFeedbackForAdmin = async (req, res) => {
  const filter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  let feedback;
  try {
    feedback = await Feedback.findOne(filter, "-_id -__v");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json({ message: "feedback doesn't exists" });
  }

  res.status(200).json(feedback);
};

const getFeedbacksForAdmin = async (req, res) => {
  let feedbacks;

  try {
    feedbacks = await Feedback.find(
      {},
      "-subjects -electiveSubjects -createdAt -updatedAt -_id -__v"
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedbacks[0]) {
    return res.status(409).json({ message: "no feedbacks" });
  }

  res.status(200).json({ feedbacks });
};

const getFeedbackForStudent = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    isLive: true,
  };

  let feedback;

  try {
    feedback = await Feedback.findOne(filter);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json({ message: "no feedback to submit" });
  }

  let electiveSubjects = [];
  feedback.electiveSubjects.map((elective, idx) => {
    if (Number(elective.regNo) === req.regNo) {
      electiveSubjects.push({
        subjectCode: elective.subjectCode,
        subjectName: elective.subjectName,
        faculty: elective.faculty,
        facultyPosition: elective.facultyPosition,
        facultyDepartment: elective.facultyDepartment,
      });
    }
  });

  feedback.electiveSubjects = electiveSubjects;

  res.status(200).json({ feedback });
};

const updateFeedbackForAdvisor = async (req, res) => {
  const filter = {
    batch: req.batch,
    degree: req.degree,
    section: req.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  const updateData = {
    isLive: req.body.isLive,
  };

  const updateSubjectsData = [...req.body.subjects];
  const updateElectiveSubjectsData = [...req.body.electiveSubjects];

  let feedback;

  try {
    feedback = await Feedback.findOne({
      ...filter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json("feedback does'nt exists");
  }

  try {
    feedback = await Feedback.updateOne(filter, {
      $set: {
        isLive: updateData.isLive,
        subjects: updateSubjectsData,
        electiveSubjects: updateElectiveSubjectsData,
      },
    });

    // updatSubjectsData.map(async (subject) => {
    //   feedback = await Feedback.updateOne(
    //     {
    //       ...filter,
    //       "subjects.subjectCode": subject.subjectCode,
    //     },
    //     {
    //       $set: {
    //         "subjects.$.subjectCode": subject.subjectCode,
    //         "subjects.$.subjectName": subject.subjectName,
    //         "subjects.$.faculty": subject.faculty,
    //         "subjects.$.facultyPosition": subject.facultyPosition,
    //         "subjects.$.facultyDepartment": subject.facultyDepartment,
    //       },
    //     },
    //     {
    //       upsert: true,
    //     }
    //   );
    //   console.log(feedback);
    // });

    // const resp = await Feedback.bulkWrite([
    // {
    //   updateOne: {
    //     filter: { name: "Will Riker" },
    //     update: { age: 29 },
    //     upsert: true,
    //   },
    // },
    // updatSubjectsData.map((subject) => ({
    //   updateOne: {
    //     filter: { ...filter, "subjects.subjectCode": subject.subjectCode },
    //     update: {
    //       $set: {
    //         "subjects.$.subjectCode": subject.subjectCode,
    //         "subjects.$.subjectName": subject.subjectName,
    //         "subjects.$.faculty": subject.faculty,
    //         "subjects.$.facultyPosition": subject.facultyPosition,
    //         "subjects.$.facultyDepartment": subject.facultyDepartment,
    //       },
    //     },
    //     upsert: true,
    //   },
    // })),

    // {
    //   updateOne: {
    //     filter: { name: "Geordi La Forge" },
    //     update: { age: 29 },
    //     upsert: true,
    //   },
    // },
    // ]);
    // console.log(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ message: "feedback updated successfully" });
};

const updateFeedbackForAdmin = async (req, res) => {
  const filter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  const updateData = {
    isLive: req.body.isLive,
  };

  const updateSubjectsData = [...req.body.subjects];
  const updateElectiveSubjectsData = [...req.body.electiveSubjects];

  let feedback;

  try {
    feedback = await Feedback.findOne({
      ...filter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  if (!feedback) {
    return res.status(409).json("feedback does'nt exists");
  }

  try {
    feedback = await Feedback.updateOne(filter, {
      $set: {
        isLive: updateData.isLive,
        subjects: updateSubjectsData,
        electiveSubjects: updateElectiveSubjectsData,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res.status(200).json({ message: "feedback updated successfully" });
};

const submitFeedbackForStudent = async (req, res) => {
  console.log(req.body);
};

module.exports = {
  addFeedback,
  updateFeedbackForAdvisor,
  updateFeedbackSubject,
  addFeedbackSubject,
  deleteFeedbackSubject,
  deleteFeedback,
  getFeedbacksForAdvisor,
  getFeedbackForStudent,
  getFeedbackForAdmin,
  updateFeedbackForAdmin,
  getFeedbacksForAdmin,
  getFeedbackForAdvisor,
  submitFeedbackForStudent,
  deleteFeedbackForAdmin,
};
