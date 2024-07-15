const { Staff } = require("../../models/Staff.js");
const { tryCatch } = require("../../utils/tryCatch.js");

const updateAdvisorForAdmin = async (req, res) => {
  /**
   * BODY={
   *  batch: 0,
   *  degree: "",
   *  section: "",
   *  userName: ""
   * }
   *
   * STEPS:
   *    - checking if userName exists
   *    - checking if any user exists in the new update data
   *    - if not update the details of the user
   */
  let advisor, advisorUpdateFilter, advisorUpdateData;
  const { userName } = req.body;

  advisorUpdateFilter = {
    userName: userName,
  };
  advisorUpdateData = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
  };

  advisor = await tryCatch(
    Staff.findOne(advisorUpdateFilter)
  );
  if (advisor?.notOkay)
    return res.status(500).json(advisor?.error);

  if (!advisor) {
    return res
      .status(409)
      .json({ eMessage: "staff does'nt exists" });
  }

  advisor = await tryCatch(
    Staff.findOne(advisorUpdateData)
  );
  if (advisor?.notOkay)
    return res.status(500).json(advisor?.error);

  if (advisor) {
    return res.status(409).json({
      eMessage:
        "advisor already exists for that particular class",
    });
  }

  advisor = await tryCatch(
    Staff.updateOne(advisorUpdateFilter, advisorUpdateData)
  );
  if (advisor?.notOkay)
    return res.status(500).json(advisor?.error);

  return res.status(200).json({ message: "Staff updated" });
};

module.exports = {
  updateAdvisorForAdmin,
};
