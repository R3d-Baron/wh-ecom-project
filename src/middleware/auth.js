const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config').JWT;
const JWTAuth = require('../utils/jwtToken');

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    let token = null;
    const bearerToken = req.headers["authorization"];
    if (bearerToken && bearerToken.split(" ")[0] === "Bearer") {
        token = bearerToken.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorHandler("No Token Provided!", 401));
    } else {
        let validToken = await JWTAuth.findByToken(token);
        if (!validToken) {
            return res
                .status(401)
                .json({ status: false, message: "Invalid Token!", data: {} });
        }
        jwt.verify(token, jwtConfig.secret, function (err, decoded) {
            if (err) {
                return next(new ErrorHandler("Invalid Token!", 401));
            } else {
                req.user = decoded;
                next();
            }
        });
    }
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // if (!roles.includes(req.user.role)) {
        //     return next(
        //         new ErrorHandler(
        //             `Role: ${req.user.role} is not allowed to access this resource`, 403
        //         )
        //     );
        // }

        next();
    }
}

exports.authorizeRolesClients = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`, 403
                )
            );
        }

        next();
    }
}

exports.checkHeaderClients = catchAsyncErrors(async (req, res, next) => {

    const contentType = req.headers['content-type'];
    const acceptLanguage = req.headers['accept-language'];

    if (!contentType || !acceptLanguage) {
        return next(new ErrorHandler("Headers data is not provided", 400));
    }
    if (contentType && contentType != 'application/json') {
        return next(new ErrorHandler("Content-Type header accept only application/json", 400));
    }
    if (acceptLanguage && acceptLanguage != 'en-US') {
        return next(new ErrorHandler("Accept-language accept only en-US", 400));
    }

    next();
});


exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    let token = req.headers["token"];
    if (token && token.split(" ")[0] === "Bearer") {
        token = token.split(" ")[1];
    }
    if (!token) {
        return next(new ErrorHandler("No Token Provided!", 401));
    } else {
        jwt.verify(token, jwtConfig.secret, async function (err, decoded) {
            if (err) {
                return next(new ErrorHandler("Invalid Token!", 401));
            } else {
                let validToken = await JWTAuth.findByRiderToken(token, decoded);
                if (!validToken) {
                    return res
                        .status(401)
                        .json({ status: false, message: "Invalid Token!", data: {} });
                }else{
                    req.user = decoded;
                    next();
                }
            }
        });
    }
});