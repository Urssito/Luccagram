const express = require("express");
const override = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require("morgan");
require('dotenv').config();

// Initializations
const app = express();
require("./config/diskStorage");
require("./database");
require("./helpers/updateSchemas.js");

// settings
app.set('trust proxy', 1);
app.set("port", process.env.PORT || 8080);
const hosts = ['http://localhost:8080/', 'http://localhost:3000', 'https://luccagram.herokuapp.com'];
require('./config/webPush');

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
app.use(morgan('dev'))

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/publications"));
app.use(require("./routes/users"));

// Static Files
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname,'..','node_modules')));

// server is listening
const server = app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
});

module.exports = {server};

require('./config/socket.io');