const BaseController = require("./BaseController");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const RequestHandler = require("../utils/RequestHandler");
const productModel = require("../models/productModel");
const attributeModel = require("../models/attributeModel");
const categoryModel = require("../models/categoryModel");

class ProductController extends BaseController {
  constructor() {
    super();
  }

  static listProducts = catchAsyncErrors(async (req, res, next) => {
    let products = [];
    let { text, categoryId, } = req.body;

    if (req.method == "POST") {
      let match = {
        $or: [
          {
            name: {
              $regex: ".*" + text + ".*",
              $options: "i",
            },
          },
          {
            description: {
              $regex: ".*" + text + ".*",
              $options: "i",
            },
          },
        ],
      };
      if(categoryId){
        let category = await categoryModel.findOne({
          _id: categoryId,
        });
        match.category = category._id;
      }
      const aggregatorOpts = [
        {
          $addFields: {
            name: "$name",
            description: "$description",
            category: "$category",
          },
        },
        {
          $match: match,
        },
      ];
      products = await productModel.aggregate(aggregatorOpts).exec();

      await categoryModel.populate(
        products, 
        [
          {
            "path": "category",
            "model": "categoriesCollection",
          },
          {
            "path": "attributes",
            "model": "Attribute",
          },
        ]
      );
    } else {
      products = await super.getList(req, productModel, "");
    }

    if(products.length > 0){
      return res.status(200).json({
        status: true,
        message: "Products fetched successfully",
        data: products,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "No products found.",
        data: [],
      });
    }
  });

  static addOrUpdateProduct = catchAsyncErrors(async (req, res, next) => {
    const { name, description, category, attributes, _id } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({
        status: false,
        message: "Product name and category are required.",
        data: {},
      });
    }

    // check if the provided attributes are valid ObjectIds
    if (attributes && attributes.length > 0) {
      const invalidAttributes = await Promise.all(
        attributes.map(async (attrId) => {
          const attributeExists = await attributeModel.exists({ _id: attrId });
          return !attributeExists ? attrId : null;
        })
      );
      if (invalidAttributes.some((attr) => attr !== null)) {
        return res.status(400).json({
          status: false,
          message: "One or more attributes are invalid.",
          data: {},
        });
      }
    }

    let data = {
      name: name,
      description: description || null,
      category: category,
      attributes: attributes || [],
    };

    let checkExist = await super.getByCustomOptionsSingle(req, productModel, {
      name: name,
    });

    if (!_id && checkExist) {
      return res.status(422).json({
        status: false,
        message: "Product with the same name already exists.",
        data: {},
      });
    }

    let updated =
      _id
        ? await super.updateById(productModel, _id.toString(), data)
        : await super.create(res, productModel, data);

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

  static getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    const product = await productModel.findOne({ _id: id });

    if (!product) {
      return res.status(400).json({
        status: false,
        message: "No details found.",
        data: {},
      });
    }

    return res.status(200).json({
      status: true,
      message: "Product details fetched successfully",
      data: product,
    });
  });

  static deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    const updated = await super.deleteById(productModel, id);

    return res.status(200).json({
      status: true,
      message: "Product deleted successfully",
      data: updated,
    });
  });
}

module.exports = ProductController;
