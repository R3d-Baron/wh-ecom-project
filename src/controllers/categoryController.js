const BaseController = require("./BaseController");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const RequestHandler = require("../utils/RequestHandler");
const categoryModel = require("../models/categoryModel");

const requestHandler = new RequestHandler();

class CategoryController extends BaseController {
  constructor() {
    super();
  }

  static categoryList = catchAsyncErrors(async (req, res, next) => {
    let { name, description, isActive } = req.body;
  
    let match = {
      isDeleted: false,
    };
  
    if (name) {
      match.name = { $regex: ".*" + name + ".*", $options: "i" };
    }
  
    if (description) {
      match.description = { $regex: ".*" + description + ".*", $options: "i" };
    }
  
    if (typeof isActive === "boolean") {
      match.isActive = isActive;
    }
  
    const aggregatorOpts = [
      { $match: match },
      { $addFields: { name: "$name", description: "$description", isActive: "$isActive" } },
    ];
  
    let categories = await categoryModel.aggregate(aggregatorOpts).exec();
  
    if(categories.length > 0){
      return res.status(200).json({
        status: true,
        message: "Successful.",
        data: categories
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "No data found.",
        data: []
      });
    }
  });
  

  static categoryAddUpdate = catchAsyncErrors(async (req, res, next) => {
    const { name, description, _id } = req.body;

    const data = {
      name: name,
      description: description,
    };

    let checkExist = await super.getByCustomOptionsSingle(req, categoryModel, {
      name: name,
    });

    if (!_id && checkExist) {
      return res.status(422).json({
        status: false,
        message: "Category with same name is already added.",
        data: {},
      });
    }

    const updated =
      _id && _id !== null && _id !== ""
        ? await super.updateById(categoryModel, _id.toString(), data)
        : await super.create(res, categoryModel, data);

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

  static getCategoryDetails = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    let category = await categoryModel.findOne({ _id: id });
    if (category) {
      return res.status(200).json({
        status: true,
        message: "Successful.",
        data: category
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "No details found.",
        data: {}
      });
    }
  });

  static deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    const updated = await super.deleteById(categoryModel, id);
    return res.status(200).json({
      status: true,
      message: "Successful.",
      data: {}
    });
  });
}

module.exports = CategoryController;
