// require("dotenv").config();

const HTTP = {
    port: process.env.APP_ENV == "production" ? process.env.PORT : 4100,
};
const APPNAME = {
    port:
        process.env.APP_ENV == "production"
            ? process.env.APP_NAME
            : "WHECOMDB",
};
const APPURL =
    process.env.APP_ENV == "production"
        ? process.env.API_URL
        : "http://localhost:4100";
const Mongo = {
    path: process.env.APP_ENV == "production" ? process.env.DB_HOST : "0.0.0.0",
    user: process.env.APP_ENV == "production" ? process.env.DB_USER : "",
    pwd: process.env.APP_ENV == "production" ? process.env.DB_PASSWORD : "",
    port: process.env.APP_ENV == "production" ? process.env.DB_PORT : 27017,
    dbName: process.env.APP_ENV == "production" ? process.env.DB_NAME : "WHECOMDB",
};

let JWT = {
    secret:
        process.env.APP_ENV == "production"
            ? process.env.JWT_SECRET
            : "some-silly-secret-access-token-shit",
    options: {
        expiresIn: 60 * 60 * 24 * 30,
    },
    refresh: {
        secret:
            process.env.APP_ENV == "production"
                ? process.env.JWT_REFRESH_SECRET
                : "some-silly-secret-refresh-token-shit",
        options: {
            expiresIn: 60 * 60 * 24 * 30,
        },
    },
};

const Timezone = process.env.APP_ENV == "production" ? process.env.TIMEZONE : "Asia/Calcutta";

const GoogleApiKey = process.env.GOOGLE_API_KEY;

module.exports = {
    HTTP,
    APPNAME,
    APPURL,
    Mongo,
    JWT,
    Timezone,
    GoogleApiKey,
};