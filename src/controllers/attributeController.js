const BaseController = require("./BaseController");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const RequestHandler = require("../utils/RequestHandler");
const attributeModel = require("../models/attributeModel");

const requestHandler = new RequestHandler();

class AttributeController extends BaseController {
  constructor() {
    super();
  }

  static listAttributes = catchAsyncErrors(async (req, res, next) => {
    let attributes = [];
    let { text } = req.body;

    if(!text){
      text = "";
    }
    if (req.method == "POST") {
      let match = {
        $or: [
          {
            name: {
              $regex: ".*" + text + ".*",
              $options: "i",
            },
          },
        ],
      };
      const aggregatorOpts = [
        {
          $addFields: {
            name: "$name",
          },
        },
        {
          $match: match,
        },
      ];
      attributes = await attributeModel.aggregate(aggregatorOpts).exec();
    } else {
      // ======= for dropdown =========== (if no text, return all attributes)
      attributes = await super.getList(req, attributeModel, "");
    }

    if(attributes.length > 0){
      return res.status(200).json({
        status: true,
        message: "Successful.",
        data: attributes
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "No data found.",
        data: []
      });
    }
  });

  static addOrUpdateAttribute = catchAsyncErrors(async (req, res, next) => {
    let { name, values, _id } = req.body;

    if (!name) {
      return res.status(422).json({
        status: false,
        message: "Name is required.",
        data: {},
      });
    }
    if (!values || !Array.isArray(values) || values.length === 0) {
      return res.status(422).json({
        status: false,
        message: "Values are required and must be an array.",
        data: {},
      });
    }

    let data = {
      name: name,
      values: values,
    };

    let checkExist = await super.getByCustomOptionsSingle(req, attributeModel, {
      name: name,
    });

    if (!_id && checkExist) {
      return res.status(422).json({
        status: false,
        message: "Attribute with same name is already added.",
        data: {},
      });
    }

    let updated =
      _id && _id != null && _id != ""
        ? await super.updateById(attributeModel, _id.toString(), data)
        : await super.create(res, attributeModel, data);

    if (updated) {
      return res.status(200).json({
        status: true,
        message: "Successful.",
        data: updated,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Oops..!! Something went wrong.",
        data: {},
      });
    }
  });

  static getAttributeDetails = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    let attribute = await attributeModel.findOne({ _id: id });

    if (attribute) {
      return res.status(200).json({
        status: true,
        message: "Successful.",
        data: attribute
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "No details found.",
        data: {}
      });
    }

  });

  static deleteAttribute = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    let updated = await super.deleteById(attributeModel, id);

    return res.status(200).json({
      status: true,
      message: "Successful.",
      data: {}
    });
  });
}

module.exports = AttributeController;
