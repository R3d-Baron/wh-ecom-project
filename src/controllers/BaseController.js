const RequestHandler = require("../utils/RequestHandler");
const _ = require("lodash");
const requestHandler = new RequestHandler();

class BaseController {
    constructor(options) {
        this.limit = 20;
        this.options = options;
    }

    static async sendPasswordResetToken(modelName, email, res) {
        try {
            const user = await modelName.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Generate a unique token for password reset
            const resetToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

            await user.save();

            // Send the reset token to the user (you can use your preferred method here, e.g., email)
            // Example: sendResetTokenViaEmail(user.email, resetToken);

            res.status(200).json({ message: 'Password reset token sent' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req, modelName) {
        const reqParam = req.params.id;
        let result;
        try {
            result = await modelName.findOne({ _id: reqParam, isDeleted: false }).select('-__v');
        } catch (err) {
            return Promise.reject(err);
        }
        return result;
    }

    static async getByToken(req, modelName, condition) {
        const reqParam = req;
        let result;
        try {
            result = await modelName.findOne({ _id: reqParam, isDeleted: false }, condition).select('-__v');
        } catch (err) {
            return Promise.reject(err);
        }
        return result;
    }

    static async getByCustomOptions(req, modelName, options) {
        let result;
        try {
            result = await modelName.find(options);
            if (result != '') {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    static async getByCustomOptionsSingle(req, modelName, options) {
        let result;
        try {
            result = await modelName.findOne(options).sort({ createdAt: -1 }).lean(true);
            // The lean option tells Mongoose to skip hydrating the result documents. This makes queries faster and less memory intensive, but the result documents are plain old JavaScript objects (POJOs), not Mongoose documents.
            // In general, if you do not modify the query results and do not use custom getters, you should use lean() . If you modify the query results or rely on features like getters or transforms, you should not use lean() .
        } catch (err) {
            return Promise.reject(err);
        }
        return result;
    }

    static async deleteById(modelName, deleteId) {
        let result;
        try {
            result = modelName.findByIdAndDelete(deleteId);
        } catch (err) {
            return Promise.reject(err);
        }
        return result;
    }

    static async create(res, modelName, data) {
        let obj = data;
        if (_.isUndefined(obj)) {
            obj = req.body;
        }
        let result;
        try {
            const document = new modelName(data);
            result = await document.save();
        } catch (err) {
            return Promise.reject(err);
        }
        return result;
    }

    static async updateById(modelName, id, updateFields) {
        let result;
        try {
            result = await modelName.findByIdAndUpdate(id, updateFields, {
                new: true, // Return the updated document instead of the old one
                runValidators: true, // Run the model's validators on update
            });

        } catch (err) {
            console.log(err);
            // return Promise.reject(err);
        }
        return result;
    }

    static async updateByCustomOptions(modelName, options, updateFields) {
        let result;
        try {
            result = await modelName.updateOne(
                options, 
                updateFields, 
                {
                    new: true, // Return the updated document instead of the old one
                    runValidators: true, // Run the model's validators on update
                }
            );
        } catch (err) {
            console.log(err);
            // return Promise.reject(err);
        }
        return result;
    }

    static async getList(req, modelName, options) {
        let results;
        try {
            results = await modelName.find({ isDeleted: false, isActive: true }).select('-__v');

        } catch (err) {
            return Promise.reject(err);
        }
        return results;
    }

    static async statusChange(modelName, id, updateFields) {
        let result;
        try {
            result = await modelName.findByIdAndUpdate(id, updateFields, {
                new: true,
                runValidators: true,
            });

        } catch (err) {
            return Promise.reject(err);
        }
        return result;
    }

    static async verifyOTP(ModelName, phone, code) {
        User.findOne({
            _id: userId,
            'otp.code': enteredOTP,
            'otp.expiration': { $gte: new Date() }, // Verify that OTP is not expired
        })
            .then(user => {
                if (user) {
                    user.otp.code = null;
                    user.otp.expiration = null;
                    user.save();
                } else {
                    console.log('Invalid OTP or expired.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

}

module.exports = BaseController;
