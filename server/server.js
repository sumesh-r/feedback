const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connection = require("./db");
const student_routes = require("./routes/student-routes");
const feedback_routes = require("./routes/feedback-routes");
const auth_routes = require("./routes/auth-routes");
const response_routes = require("./routes/response-routes");
const staff_routes = require("./routes/staff-routes");
const report_routes = require("./routes/report-routes");
const exec = require("child_process").exec; // for updating the server and client

// connecting to database
connection();

// Variables
const PORT = process.env.PORT || 8080;
const whitelist = process.env.FRONT_URL;
const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT === "true";

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || IS_DEVELOPMENT) {
//       callback(null, true);
//     } else {
//       callback("Not allowed.", false);
//     }
//   },
//   optionsSuccessStatus: 200, // For legacy browser support
//   credentials: true,
//   allowedHeaders: [
//     "Access-Control-Allow-Origin",
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "Accept",
//     "Authorization",
//   ],
//   methods: ["GET", "POST", "OPTIONS"],
//   contentType: "application/json",
//   maxAge: 3600
// };

const corsOptions = {
  origin: whitelist,
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
  methods: "GET, POST",
  contentType: "application/json",
};

const update_Image = (req, res, next) => {
  //   Server update command : docker service update -d --image tamilarasug/feedback-server:latest backend_server
  // client update command : docker service update -d --image tamilarasug/feedback-client:latest frontend_client
  const command = "ls";
  const data = exec(command, function (error, stdout, stderr) {
    // console.log(stdout);
    if (stdout) return stdout;

    if (error) {
      console.log(error);
    }
  });
  if (data) return res.status(200).json(data);
  return res.status(500).json("something wrong");
};

// middlewares
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(cookieParser());

morgan.token("date", function () {
  var p = new Date()
    .toString()
    .replace(/[A-Z]{3}\+/, "+")
    .split(/ /);
  return p[2] + "/" + p[1] + "/" + p[3] + ":" + p[4] + " " + p[5];
});

app.use(
  morgan(
    `[:date[clf]] ":method :url" :status :res[content-length]b :response-time ms`
  )
);
app.use(express.json());

// set routes
app.use("/api/student", student_routes);
app.use("/api/feedback", feedback_routes);
app.use("/api/auth", auth_routes);
app.use("/api/response", response_routes);
app.use("/api/staff", staff_routes);
app.use("/api/report", report_routes);


// route to update the server and client
app.use("/api/update-image", update_Image);

// listening to port
try {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}....`);
  });
} catch (error) {
  console.log(error);
}

// backup cmd
// mongodump --uri='mongodb://username:password@localhost:27017/feedback' --gzip --archive=/data/backup/backup.gz
// restore cmd
// mongorestore mongodb://username:password@0.0.0.0:27017/feedback --gzip --archive=./temp.gz --authenticationDatabase=admin

// * TODO: cors stop postman
// * TODO: removed unwanted dependencies
// * TODO: change way of handling passwords
// * TODO: update server automatically
// TODO: check if student regNo belongs to same class in elective
// TODO: student submit feedback
// TODO: change useEffect to something
// TODO: generate report after initiating feedback
// TODO: crud advisors by admin
// TODO: reset passwords
