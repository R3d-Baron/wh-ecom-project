const jwt = require("jsonwebtoken");
const jwtConfig = require("../config").JWT;
const tokenSet = {};
const User = require("../models/userModel");

/********* Create Token and Save in Database ********/

const sign = function (data) {
    let accessToken = jwt.sign(data, jwtConfig.secret, jwtConfig.options);
    let refreshToken = jwt.sign(data, jwtConfig.refresh.secret, jwtConfig.refresh.options);
    tokenSet[refreshToken] = { accessToken, refreshToken };
    return { accessToken, refreshToken };
};

const clientSign = function (data) {
    let token = jwt.sign(data, jwtConfig.secret, jwtConfig.options);
    return token;
};

const refreshToken = function (req, res, next) {
    const { refreshToken } = req.body;
    if (refreshToken && refreshToken in tokenSet) {
        jwt.verify(refreshToken, jwtConfig.refresh.secret, function (err, decoded) {
            if (err) {
                res
                    .status(401)
                    .json({ status: false, message: "Invalid Token!", data: {} });
            } else {
                const { _id, name, phone, role, email } = decoded;
                const accessToken = jwt.sign(
                    { _id, name, phone, role, email },
                    jwtConfig.secret,
                    jwtConfig.options
                );
                tokenSet[refreshToken].accessToken = accessToken;
                res.json({ accessToken });
            }
        });
    } else res.status(401).json({ status: false, message: "Invalid Token!", data: {} });
};

const findByRiderToken = async (token, data) => {
    try {
        let user = await User.findOne({
            isDeleted: false,
            _id: data._id
        });
        if (user) {
            if(Number(data.deviceType) == 2){
                if(user.webLogin?.accessToken == token){
                    return true
                }else{
                    return false
                }
            }else{
                if(user.appLogin?.accessToken == token){
                    return true
                }else{
                    return false
                }
            }
        }
        return false;
        
    } catch (error) {
        return { error };
    }
};

const findByToken = async (token) => {
    try {
        let user = await User.findOne({ accessToken: token, isDeleted: false });
        if (user) {
            return user;
        }
        return false;
    } catch (error) {
        return { error };
    }
};

const accountStatus = async (data) => {
    try {
        let user = await User.findOne({
            isDeleted: false,
            _id: data._id
        });
        if (user.isActive == true) {
            return true
        }else{
            return false;
        }
        
    } catch (error) {
        return { error };
    }
};

module.exports = {
    Sign: sign,
    ClientSign: clientSign,
    RefreshTokenMiddleware: refreshToken,
    findByRiderToken: findByRiderToken,
    findByToken: findByToken,
    accountStatus: accountStatus,
};
