const axios = require('axios');
const BaseController = require("../BaseController");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");

const RequestHandler = require("../../utils/RequestHandler");
const {
    MSG_RECORD_STATUS_SUCCESS,
    MSG_RECORD_FETCH_SUCCESS
} = require("../../config/constants");
const requestHandler = new RequestHandler();

class CommonController extends BaseController {

    constructor() {
        super();
    }

}

module.exports = CommonController;
