const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const tokenPath = path.join(__dirname, "..", "..", "credentials.json")
const tokenRaw = fs.readFileSync(tokenPath);
const REFRESH_TOKEN = JSON.parse(tokenRaw).web.refresh_token;
const CLIENT_ID = JSON.parse(tokenRaw).web.client_id;
const CLIENT_SECRET = JSON.parse(tokenRaw).web.client_secret;
const REDIRECT_URI = JSON.parse(tokenRaw).web.redirect_uris[1];

const oAuth2Clilent = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Clilent.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: "v3",
    auth: oAuth2Clilent
});

module.exports = drive;