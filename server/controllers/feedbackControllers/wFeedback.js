// w-write
// u-update
// g-get
// d-delete
const {Student} = require("#models/Student.js")


const getStudent = async (req,res) => {
    let student = await Student.findOne({ regNo: 20104179 });
    console.log(student);
}

module.exports = {
    getStudent
}