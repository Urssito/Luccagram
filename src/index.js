const express = require("express"),
      hbs = require("express-handlebars"),
      handlebars = require("handlebars"),
      override = require("method-override"),
      session = require("cookie-session"),
      flash = require("connect-flash"),
      path = require("path"),
      passport = require("passport"),
      cookie = require("cookie-parser");

// Initializations
const app = express();
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
require("./helpers/handlebars");
require("./config/diskStorage");
require("./database");
require("./config/passport");
require("./helpers/handlebars");
require("./config/googleAuth")

// settings
app.set("port", process.env.PORT || 8080);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", hbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",

    helpers: {
        calculation: "s"
    }
}));

app.set("view engine", "hbs");

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(override("_method"));
app.use(session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req,res,next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.error = req.flash("error");
    let user = null;
    if(req.user){
         user =JSON.parse(JSON.stringify(req.user));
    }
        
    res.locals.user = user;
    next();
});

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/publications"));
app.use(require("./routes/users"));

// Static Files
app.use(express.static(path.join(__dirname, "public")))

// server is listening
app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
});