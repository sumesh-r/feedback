const mongoose = require("mongoose");

// there are two types of staff
      // -advisor
      // -admin

const staffSchema = mongoose.Schema(
  {
    userName: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    batch: { type: Number, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
  },
  { versionKey: false, strict: true, strictQuery: false }
);

const Staff = mongoose.model("Staff", staffSchema);

module.exports = { Staff };
