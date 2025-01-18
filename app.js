const express = require("express");
const app = express();
const axios = require("axios");
const morgan = require("morgan")
const cors = require("cors");
const errorMiddleware = require("./src/middleware/error");
const cookieParser = require("cookie-parser");
const expressFileUpload = require("express-fileupload");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const moment = require('moment-timezone');


app.use(express.json());
// app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());
app.use(expressFileUpload({ parseNested: true }));
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginEmbedderPolicy: true,
  })
);

// =================== express-rate-limit ===================
const limiter = rateLimit({
	windowMs: 1 * 1000, // 1 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later."
});
app.use(limiter);
// ========== error handling for rateLimit exceeded ============
app.use((err, req, res, next) => {
	if (err instanceof rateLimit.RateLimitError) {
			// Handle rate limit exceeded error
			res.status(429).send("Rate limit exceeded");
	} else {
			next(err);
	}
});
// ========== error handling for rateLimit exceeded ============
// =================== express-rate-limit ===================

app.use("/", require("./src/routes/attributeRoute"));
app.use("/", require("./src/routes/categoryRoute"));
app.use("/", require("./src/routes/productRoute"));
app.use("/", require("./src/routes/productVariationRoute"));
app.use("/", require("./src/routes/stockRoute"));
app.use("/", require("./src/routes/pricingRoute"));

/*************** Morgan Log Configuration ****************/
if (process.env.APP_ENV == 'production') {
    app.use(morgan("production"))
}
if (process.env.APP_ENV == 'development') {
    app.use(morgan("dev"))
}

app.use('src/public/uploads', express.static('uploads'));

app.use(errorMiddleware);
app.use('/uploads', express.static('src/public/uploads'))

module.exports = app;
