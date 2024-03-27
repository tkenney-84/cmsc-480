// Import all necessary packages.
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql2");
const rateLimiter = require("express-rate-limit");
var cors = require("cors");

// Declare a new instance of the express NodeJS framework for use as our
// backend server.
var app = express();

// Create database connection for this instance of the backend server.
// This connection is stored globally for use across all route js files.
global.database = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  multipleStatements: false,
  // Do not add an 'sslmode' property. It is not needed or supported by mysql2.
});

// Log the status of the database connection to whatever terminal launched the
// backend server.
console.info("DATABASE CONFIGURED?", global.database.config.user != null);

// Connect to the database using the connection object created above.
// If an error occurs, log the error and kill the server.
global.database.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    // process.exit(); Removed for production server persistence.
    // It is better to live with a DB error than to kill the entire backend
    // server.
  }
});

// Enable CORS for all routes. This is necessary for the frontend to be able to
// make requests to the backend server. If this is modified, CORS errors will
// block all requests from the frontend to this backend server.
var corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200, // Necessary for legacy browser support.
};

// Apply CORS options to all application requests.
app.use(cors(corsOptions));

// Implement basic rate limiting for all requests to the backend server.

// Limit each origin IP to 'maximumRequests' requests per 'perMilliseconds'
// milliseconds.
var maximumRequests = 100;
var perMilliseconds = 60 * 1000;

// Create a rate limiter object with the above parameters.
const apiLimiter = rateLimiter({
  windowMs: perMilliseconds,
  max: maximumRequests,
  handler: function (req, res, next) {
    res.status(429);
    res.send({
      success: false,
      message: `The server has received too many requests in a short period, please try again later.`,
    });
  },
});

// Apply the rate limiter to all requests to this backend server..
app.use(apiLimiter);

// Import all route files for the backend server.
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var solarPanelMovement = require("./routes/solarPanelControl");
var solarData = require("./routes/solarData");

// Support for view functionality offered by ExpressJS.
// Not explicitly used in this project, but left in for fear of dependency.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware for parsing incoming requests.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Declare base URL stub for all route files.
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/solarPanelControl", solarPanelMovement);
app.use("/solarData", solarData);

// Handle requests to unknown routes.
app.use(function (req, res, next) {
  // next(createError(404));
  res.status(404);
  res.send({
    success: false,
    message: "API endpoint not found.",
  });
});

// Handle errors with the backend server.
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error =
    process.env.ENVIRONMENT === "local"
      ? err
      : "Request error present, but obscured for security reasons. Please check the server logs for more information.";

  // If there is a status associated with this error, send it in the response.
  // Otherwise send a general 500 server error.
  res.status(err.status || 500);

  // Do not render the error page. All views should be handled by the front end.
  // res.render('error');

  res.send({
    success: false,
    message: "An error occurred while processing the request.",
    error: res.locals.error,
  });
});

// Whenever this backend server is killed, close the MySQL connection.
process.on("SIGINT", function () {
  global.database.end(function (err) {
    if (err) {
      console.error("Failed to close MySQL connection:", err);
    } else {
      console.info("MySQL connection closed.");
    }

    // It is fine to kill the process here, as if we have reached this block,
    // it is what is intended.
    process.exit();
  });
});

global.database.on("error", function (err) {
  // If the error is a connection error, attempt to reconnect.
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.warn("Database connection lost. Attempting to reconnect...");
    global.database = mysql.createConnection(global.database.config);
  } else {
    // throw err; Removed for production server persistence.
    // It is better to live with a DB error than to kill the entire backend.
    console.error("Database Error:", err);
  }
});

module.exports = app;
