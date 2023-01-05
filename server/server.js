// imports
require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
// for updating the server and client
const cp = require("child_process");
// for connecting database new change
const connection = require("./db");
// for checking authentication
const {
  checkAdminAuth,
  checkStaffAuth,
  checkStudentAuth,
} = require("#middlewares/checkAuth.js");
const { staffLogin } = require("#controllers/authControllers.js");
// for routes
const studentRoutes = require("#routes/student-routes.js");
const advisorRoutes = require("#routes/advisor-routes.js");
const adminRoutes = require("#routes/admin-routes.js");
const authRoutes = require("#routes/auth-routes.js");

// for getting Date for console and log file
const { newDate } = require("#utils/newDate.js");

// connecting to database
connection();

// Variables
const PORT = process.env.PORT || 8080;
const whitelist = process.env.FRONT_URL;
const IS_DEVELOPMENT = process.env.IS_DEVELOPMENT === "true";

const corsOptions = {
  origin: whitelist,
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
  methods: "GET, POST",
  contentType: "application/json",
};

const update_Image = (req, res) => {
  //   Server update command : docker service update -d --image tamilarasug/feedback-server:latest backend_server
  // client update command : docker service update -d --image tamilarasug/feedback-client:latest frontend_client
  const { commit_id, server, client } = req.body;
  const isServer = server === "true";
  const isClient = client === "true";

  if (isServer && isClient) {
    console.log(
      `updating server and client with commit id: ${commit_id}  Date: ${newDate()}`
    );
    cp.exec('echo "updateScript server client" >> mypipe');
  } else if (isServer) {
    console.log(
      `updating server with commit id: ${commit_id}  Date: ${newDate()}`
    );
    cp.exec('echo "updateScript server" >> mypipe');
  } else if (isClient) {
    console.log(
      `updating client with commit id:${commit_id}  Date: ${newDate()}`
    );
    cp.exec('echo "updateScript client" >> mypipe');
  } else {
    return res.status(400).json({ eMessage: "bad request" });
  }
  return res.status(200).json({ server: isServer, client: isClient });
};


// middlewares
app.use(cookieParser());
app.use(express.json());
// route to update the server and client
app.use("/api/update-image", update_Image);
app.use("/user/login", staffLogin);

// method to block requests from unknown origins like postman
app.use((req, res, next) => {
  // only allow from unknown origin if development mode is true
  if (!req.headers.origin && !IS_DEVELOPMENT)
    return res.status(400).json({ message: "Bad request" });
  next();
});
app.use(cors(corsOptions));
morgan.token("date", newDate);
app.use(
  morgan(
    `[:date[clf]] ":method :url" :status :res[content-length]b :response-time ms`
  )
);

// set routes
app.use("/api/auth", authRoutes);
app.use("/api/student", checkStudentAuth, studentRoutes);
app.use("/api/advisor", checkStaffAuth, advisorRoutes);
app.use("/api/a", checkAdminAuth, adminRoutes);

// listening to port
try {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}  Date: ${newDate()}`);
  });
} catch (err) {
  console.log(err);
}

// backup cmd
// mongodump --uri='mongodb://username:password@localhost:27017/feedback' --gzip --archive=/data/backup/backup.gz
// restore cmd
// mongorestore mongodb://username:password@0.0.0.0:27017/feedback --gzip --archive=./temp.gz --authenticationDatabase=admin