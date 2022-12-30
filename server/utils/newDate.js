// * this function will return a current date with time in
// * the format 30/Dec/2022:22:00:03 +0530

const newDate = () => {
  var p = new Date()
    .toString()
    .replace(/[A-Z]{3}\+/, "+")
    .split(/ /);
  return p[2] + "/" + p[1] + "/" + p[3] + ":" + p[4] + " " + p[5];
};

module.exports = { newDate };
