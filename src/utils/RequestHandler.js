const _ = require('lodash');

class RequestHandler {

    catchError(res, error) {
        if (!error) error = new Error('Default error');
        res.status(error.status || 500).json({ type: 'error', message: error.message || 'Unhandled error', error });
    }

    sendSuccess(res, message, status) {
        return (data, globalData) => {
            if (_.isUndefined(status)) {
                status = 200;
            }
            res.status(status).json({
                type: 'success', message: message || 'Success result', data, ...globalData
            });
        };
    }

    sendError(req, res, error) {
        res.status(error.status || 500).json({
            type: 'error', message: error.message || error.message || 'Unhandled Error', error
        });
    }

    customError(res, statusCode, message) {
        res.status(statusCode).json({
            type: 'error', message: message || 'Unhandled Error'
        });
    }

}

module.exports = RequestHandler;
