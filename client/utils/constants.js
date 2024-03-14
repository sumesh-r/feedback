// import { departments, facultyPositions } from "@utils/constants";

const departments = [
  "AERO",
  "AGRI",
  "AIML",
  "AME",
  "BME",
  "CAM",
  "CHE",
  "CIVIL",
  "CSE",
  "ECE",
  "EEE",
  "EIE",
  "ES",
  "FT",
  "IT",
  "MBA",
  "MCA",
  "MECH",
  "MECHAT",
];

const degrees = [
  "BE-AERO",
  "BE-AGRI",
  "BE-AME",
  "BE-BME",
  "BTECH-CHE",
  "BE-CIVIL",
  "BE-CSE",
  "BE-ECE",
  "BE-EEE",
  "BE-EIE",
  "BTECH-FT",
  "BTECH-IT",
  "BTECH-AIML",
  "BE-MECHAT",
  "BE-MECH",
  "ME-CSE",
  "ME-ECE",
  "ME-ES",
  "ME-CAD/CAM",
  "MCA",
  "MBA",
];

const batches = ["2019", "2020", "2021", "2022", "2023"];

const sections = ["A", "B", "C"];

const facultyPositions = [
  "Associate Professor",
  "Professor",
  "Professor and Head",
  "IBM Trainee",
];

const remarkHeaders = [
  "subjectKnowledge",
  "clearExplanation",
  "usageOfTeachingTools",
  "extraInput",
  "teacherStudentRelationship",
];

const semesters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const remarks = [
  {
    value: 10,
    title: "Excellent",
  },
  {
    value: 8,
    title: "Good",
  },
  {
    value: 6,
    title: "Satisfactory",
  },
  {
    value: 4,
    title: "Not Satisfactory",
  },
  {
    value: 2,
    title: "Poor",
  },
];

module.exports = {
  departments,
  facultyPositions,
  degrees,
  sections,
  batches,
  remarkHeaders,
  remarks,
  semesters,
};
