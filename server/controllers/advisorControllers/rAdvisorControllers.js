const { Staff } = require("../../models/Staff.js");
const { tryCatch } = require("../../utils/tryCatch.js");

// main methods
const getAdvisorsForAdmin = async (req, res) => {
  /**
   * BODY={}
   */
  let advisors, advisorsFilter, advisorsProjection;

  advisorsFilter = {
    role: "ADVISOR",
  };

  advisorsProjection = {
    _id: 0,
    password: 0,
    role: 0,
  };

  advisors = await tryCatch(
    Staff.find(advisorsFilter, advisorsProjection)
  );
  if (advisors?.notOkay)
    return res.status(500).json(advisors?.error);

  if (!advisors[0]) {
    return res
      .status(200)
      .json([{ message: "no advisors" }]);
  }
  return res.status(200).json(advisors);
};

module.exports = {
  getAdvisorsForAdmin,
};
