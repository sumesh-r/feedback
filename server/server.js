const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connection = require("./db");
const student_routes = require("#routes/student-routes.js");
const feedback_routes = require("#routes/feedback-routes.js");
const auth_routes = require("#routes/auth-routes.js");
const response_routes = require("#routes/response-routes.js");
const staff_routes = require("#routes/staff-routes.js");
const report_routes = require("#routes/report-routes.js");
const { newDate } = require("#utils/newDate.js");
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

const update_info = {
  callback_url:
    "https://registry.hub.docker.com/u/svendowideit/testhook/hook/2141b5bi5i5b02bec211i4eeih0242eg11000a/",
  push_data: {
    pushed_at: 1417566161,
    pusher: "trustedbuilder",
    tag: "latest",
  },
  repository: {
    comment_count: 0,
    date_created: 1417494799,
    description: "",
    dockerfile:
      "#\n# BUILD\u0009\u0009docker build -t svendowideit/apt-cacher .\n# RUN\u0009\u0009docker run -d -p 3142:3142 -name apt-cacher-run apt-cacher\n#\n# and then you can run containers with:\n# \u0009\u0009docker run -t -i -rm -e http_proxy http://192.168.1.2:3142/ debian bash\n#\nFROM\u0009\u0009ubuntu\n\n\nVOLUME\u0009\u0009[/var/cache/apt-cacher-ng]\nRUN\u0009\u0009apt-get update ; apt-get install -yq apt-cacher-ng\n\nEXPOSE \u0009\u00093142\nCMD\u0009\u0009chmod 777 /var/cache/apt-cacher-ng ; /etc/init.d/apt-cacher-ng start ; tail -f /var/log/apt-cacher-ng/*\n",
    full_description: "Docker Hub based automated build from a GitHub repo",
    is_official: false,
    is_private: true,
    is_trusted: true,
    name: "testhook",
    namespace: "svendowideit",
    owner: "svendowideit",
    repo_name: "svendowideit/testhook",
    repo_url: "https://registry.hub.docker.com/u/svendowideit/testhook/",
    star_count: 0,
    status: "Active",
  },
};

const update_Image = (req, res, next) => {
  //   Server update command : docker service update -d --image tamilarasug/feedback-server:latest backend_server
  // client update command : docker service update -d --image tamilarasug/feedback-client:latest frontend_client


  // const command = "ls";
  // const data = exec(command, function (error, stdout, stderr) {
  //   // console.log(stdout);
  //   if (stdout) return stdout;

  //   if (error) {
  //     console.log(error);
  //   }
  // });


  // if (data) return res.status(200).json(data);
  // return res.status(500).json("something wrong");
  return res.status(200).json(data);
};

// middlewares
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use(cookieParser());

morgan.token("date", newDate);

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
    console.log(`listening on port ${PORT}   Date: ${newDate()}`);
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
