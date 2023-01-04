const { Staff } = require("#models/Staff.js");
const { tryCatch } = require("#utils/tryCatch.js");
const bcrypt = require("bcrypt");

const addAdvisorForAdmin = async (req, res) => {
  /**
   * BODY={
   *  batch: 0,
   *  degree: "",
   *  section: "",
   *  userName: "",
   *  password: ""
   * }
   */
  let advisor, hashPassword, advisorData, alreadyExists, advisorFilter;
  const { userName, password } = req.body;

  advisorFilter = {
    batch: req.body.batch,
    degree: req.body.degree,
    section: req.body.section,
  };

  if (!userName || !password)
    return res.status(409).json({ message: "need userName & password" });

  advisor = await tryCatch(Staff.findOne({ userName: userName }));
  if (advisor?.notOkay) return res.status(500).json(advisor?.error);

  if (advisor) {
    return res.status(409).json({ eMessage: "advisor already exists" });
  }

  alreadyExists = await tryCatch(Staff.findOne(advisorFilter));
  if (advisor?.notOkay) return res.status(500).json(advisor?.error);

  if (alreadyExists) {
    return res
      .status(409)
      .json({ eMessage: "advisor already exists for that particular class" });
  }

  hashPassword = await tryCatch(bcrypt.hash(password, 10));
  if (hashPassword?.notOkay) return res.status(500).json(hashPassword?.error);

  advisorData = {
    batch: advisorFilter.batch,
    degree: advisorFilter.degree,
    section: advisorFilter.section,
    userName: userName,
    role: "ADVISOR",
    password: hashPassword,
  };

  advisor = await tryCatch(
    Staff({
      ...req.body,
      role: "ADVISOR",
      password: hashPassword,
    }).save()
  );
  if (advisor?.notOkay) return res.status(500).json(advisor?.error);

  return res.status(200).json({ message: "Staff Added" });
};

module.exports = {
  addAdvisorForAdmin,
};
