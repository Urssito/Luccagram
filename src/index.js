const express = require("express");
const override = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");
const passport = require("passport");
const { google } = require("googleapis");
const request = require("request");
const urlParse = require("url-parse");
const queryParse = require("query-string");
const bodyParser = require("body-parser");
const fs = require('fs');
const cors = require('cors');

// Initializations
const app = express();
require("./config/diskStorage");
require("./database");
require("./helpers/updateSchemas.js");

// settings
app.set('trust proxy', 1);
app.set("port", process.env.PORT || 8080);
const hosts = ['http://localhost:8080/', 'http://localhost:3000', 'https://luccagram.herokuapp.com'];

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser('TF&^Q4U:r{gGM&hB?V,~V:*7-yB*T:'));
app.use(override("_method"));
app.use(session({
    secret: "TF&^Q4U:r{gGM&hB?V,~V:*7-yB*T:",
    resave: true,
    saveUninitialized: true
}));
app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);

        if(hosts.indexOf(origin) !== -1){
            return callback(null, true);
        }else{
            console.log(origin)
            const msg = 'ruta de origen no autorizada.';
            return callback(new Error(msg), false);
        }

    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
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
require("./config/passport");

// Static Files
app.use(express.static(path.join(__dirname, "app")));
app.use(express.static(path.join(__dirname,'..','node_modules')));

// Google Authorize
const CLIENT_ID = '488466038777-9uv4j46ee2h81omv9tlhm42dsn1q79t0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:8080/oauth2callback';

app.get("/a", (req,res) => {
    
    if(req.user && req.user.user == "urssito"){
        const oAuth2Clilent = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
        );
        const scopes = ['https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata'
      ];

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
    }else{
        res.redirect("/");
    }

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
        const credentialsPath = path.join(__dirname,'..','credentials.json');
        const credentials = JSON.parse(fs.readFileSync(credentialsPath));
        credentials.web.access_token = token.tokens.access_token;
        credentials.web.refresh_token = token.tokens.refresh_token;
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));

        res.redirect("/");

    }else{
        res.redirect('activateGoogleAPI');
    }

});

app.get("/home", (req, res) => {
    res.json({
        name: "Lucca",
        age: 19
    })
})

// server is listening
app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
});