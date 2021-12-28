const express = require("express"),
      hbs = require("express-handlebars"),
      override = require("method-override"),
      session = require("cookie-session"),
      flash = require("connect-flash"),
      path = require("path"),
      passport = require("passport"),
      { google } = require("googleapis"),
      request = require("request"),
      urlParse = require("url-parse"),
      queryParse = require("query-string"),
      bodyParser = require("body-parser");

// Initializations
const app = express();
const cookieParser = require("cookie-parser");
require("./helpers/hbsHelpers");
require("./config/diskStorage");
require("./database");
require("./config/passport");

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser('TF&^Q4U:r{gGM&hB?V,~V:*7-yB*T:'));
app.use(override("_method"));
app.use(session({
    secret: "TF&^Q4U:r{gGM&hB?V,~V:*7-yB*T:",
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

// Google Authorize
const CLIENT_ID = '488466038777-9uv4j46ee2h81omv9tlhm42dsn1q79t0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:8080/oauth2callback';

app.get("/a", (req,res) => {
    
    const oAuth2Clilent = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );
    const scopes = ['https://www.googleapis.com/auth/drive.file'];

    const url = oAuth2Clilent.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userId: req.body.userid
        })
    });

    request(url, (err, response, body) => {
        if (err) console.error;
        console.log("Status: ", res && res.statusCode);
        res.send({ url })
    });

});

app.get('/oauth2callback', async (req, res) => {
    if (req.url){

        const queryURL = new urlParse(req.url);
        const code = queryParse.parse(queryURL.query).code;

        const oAuth2Clilent = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );

        const token = await oAuth2Clilent.getToken(code);
        console.log(token);
        res.redirect("/")


    }else{
        res.redirect('activateGoogleAPI');
    }

});

// server is listening
app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
});
