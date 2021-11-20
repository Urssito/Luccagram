const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const CLIENT_ID = '488466038777-9uv4j46ee2h81omv9tlhm42dsn1q79t0.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//046-EHUl3pEzwCgYIARAAGAQSNwF-L9IrnUTtOhlNQA3wbMjIieY1Y3GJ7UAB9PdGwBedstsCn0y6sLTLRyNNYb72Ym9Cel5luOM';

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