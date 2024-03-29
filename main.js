/* Importing the required modules and controllers */
const express = require("express"),
  app = express()
router = express.Router();
const layouts = require("express-ejs-layouts");
const path = require("path");
const errorController = require("./controllers/errorController");
const usersController = require("./controllers/usersController");
const methodOverride = require("method-override");
const passport = require("passport");
const User = require("./models/user");
const expressValidator = require("express-validator");
const indexController = require("./controllers/indexController");

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v1/latest-prices.json';

const expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash");

//* Importing the required module for Mongoose and defining the database URL and name */
const mongoose = require("mongoose");
const dbURL = "mongodb+srv://tukiaaro:permamankeli@powertrace.3gljae1.mongodb.net/powertrace";
const db = mongoose.connection;

/* Connecting to the MongoDB database using Mongoose */
mongoose.connect(dbURL, {
useNewUrlParser: true,
useUnifiedTopology: true,
connectTimeoutMS: 10000,
socketTimeoutMS: 45000
}).then(() => console.log("Successfully connected to MongoDB!"))
.catch((error) => console.error(error));

/* Defining the port number and creating a new Express application */
const port = 3000;

/* Setting the view engine to ejs and the port number to 3000 */
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

router.use(
express.urlencoded({
extended: false
})
);
router.use(express.json());
router.use(expressValidator());

/* Using the layouts module and the error controller's logErrors function */
router.use(layouts);
router.use(errorController.logErrors);

/* Setting the MIME type of .css files to "text/css" */
router.use(express.static("public", {
setHeaders: function (res, path) {
if (path.endsWith(".css")) {
res.setHeader("Content-Type", "text/css");
}
},
}));

router.use(cookieParser("secret_passcode"));
router.use(expressSession({
secret: "secret_passcode",
cookie: {
maxAge: 4000000
},
resave: false,
saveUninitialized: false
}));
router.use(connectFlash());

router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
res.locals.loggedIn = req.isAuthenticated();
res.locals.currentUser = req.user;
res.locals.flashMessages = req.flash();
next();
});

// Serving static files from the "public" directory
router.use(express.static(__dirname + "public"));

// Adding a route for the root path
router.get("/", (req, res) => {
  res.redirect("/powertrace");
});

router.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));


router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate, usersController.redirectView);
router.get("/users/logout", usersController.logout, usersController.redirectView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);

router.get("/prices", indexController.getPrices);
router.get("/powertrace", indexController.index);
router.get("/powertrace/about", indexController.about);



router.post(
  "/users/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);

router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

app.use("/", router);
// Starting the server and listening on the specified port number
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
