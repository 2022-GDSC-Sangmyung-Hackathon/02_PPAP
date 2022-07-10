var createError = require("http-errors");
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var logger = require("morgan");
var bodyParser = require("body-parser");
var server = require("http").createServer(app);
const io = require("socket.io")(server);
require("dotenv").config();
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const http = require("http").Server(app);
const mongoose = require("mongoose");

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:${process.env.MONGO_PORT}/admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((error) => console.log(error));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postsRouter = require("./routes/posts");

var port = normalizePort(process.env.PORT || "3000");

// server.listen(port, () => {
//   console.log("Server listening at port %d", port);
// });

server.on("error", onError);
server.on("listening", onListening);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

/* --------------------------------------------- */
let room = ["room1", "room2", "room3"];
let a = 0;

app.io = require("socket.io")();

app.io.on("connection", (socket) => {
  console.log("유저가 들어왔다.");

  // 요거 추가
  socket.on("joinRoom", (num, name) => {
    socket.join(room[num], () => {
      app.io.to(room[num]).emit("joinRoom", num, name);
    });
  });

  // 요거 추가
  socket.on("leaveRoom", (num, name) => {
    socket.leave(room[num], () => {
      app.io.to(room[num]).emit("leaveRoom", num, name);
    });
  });

  socket.on("disconnect", () => {
    console.log("유저가 나갔다.");
  });

  socket.on("chat-msg", (num, name, msg) => {
    a = num;
    app.io.to(room[a]).emit("chat-msg", name, msg); // to(room[a])를 통해 그룹에게만 메세지를 날린다.
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
app.io.attach(http);

/* ------------------------------------------------ */

/* ------------------------------------------------ */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/* -------------------------------------------------- */

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  // debug("Listening on " + bind);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/** ----------------------------------------------------------------------------------------- */
