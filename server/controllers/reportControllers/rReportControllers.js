const { Report } = require("#models/Report.js");
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

const getReports = async (req, res) => {
  /**
    appropriate values will be provided in request by the method called.

    REQUIRED:
      - req.reportsFilter
   
    STEPS:
      - get the reports filter
      - fetch the reports
      - return the reports
 */
  let reports;
  const reportsFilter = req.reportsFilter;

  reports = await tryCatch(
    Report.find(
      reportsFilter,
      "-_id -__v -createdAt -updatedAt -subjects -electiveSubjects"
    )
  );
  if (reports?.notOkay) return res.status.json(reports?.error);

  if (!reports[0]) {
    return res.status(409).json([{ message: "reports doesn't exists" }]);
  }

  return res.status(200).json(reports);
};

// main methods
const getReportForAdmin = async (req, res) => {
  /**
   BODY = {
    batch: 0,
    degree: "",
    section: "",
    semester: "",
    feedbackNo: "",
  };
   */
  const reportFilter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
    semester: req.body.semester,
    feedbackNo: req.body.feedbackNo,
  };

  req.reportFilter = reportFilter;

  await getReport(req, res);
};
const getReportsForAdmin = async (req, res) => {
  /**
   BODY = {}
   */
  const reportsFilter = {};

  req.reportsFilter = reportsFilter;

  await getReports(req, res);
};

module.exports = {
  getReportForAdmin,
  getReportsForAdmin,
};
