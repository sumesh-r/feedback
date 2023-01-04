const { Staff } = require("#models/Staff.js");
const { tryCatch } = require("#utils/tryCatch.js");

const deleteAdvisorForAdmin = async (req, res) => {
  /**
   * BODY={
   *  userName: ""
   * }
   *
   * STEPS:
   *    - checking if userName exists
   *    - if yes delte the user
   */
  let advisor, advisorFilter;
  const { userName } = req.body;

  if (!userName) return res.status(409).json({ eMessage: "need userName" });

  advisorFilter = {
    userName: userName,
  };

  advisor = await tryCatch(Staff.findOne(advisorFilter));
  if (advisor?.notOkay) return res.status(500).json(advisor?.error);
  if (!advisor) {
    return res.status(409).json({ eMessage: "advisor does'nt exists" });
  }

  advisor = await tryCatch(Staff.deleteOne(advisorFilter));
  if (advisor?.notOkay) return res.status(500).json(advisor?.error);
  if (!advisor.acknowledged) {
    return res.status(409).json({
      eMessage: "something went wrong",
    });
  }

  return res.status(200).json({ message: "advisor deleted" });
};

module.exports = {
  deleteAdvisorForAdmin,
};
