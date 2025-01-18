const BaseController = require("./BaseController");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const RequestHandler = require("../utils/RequestHandler");
const fileUploaderSingle = require("../utils/fileUpload").fileUploaderSingle;
const productVariationModel = require("../models/productVariationModel");
const attributeModel = require("../models/attributeModel");
const productModel = require("../models/productModel");

const requestHandler = new RequestHandler();

class ProductVariationController extends BaseController {
  constructor() {
    super();
  }

  static listProductVariations = catchAsyncErrors(async (req, res, next) => {
    let productVariations = [];
    let { productId, } = req.body;

    if (req.method == "POST") {
      let match = {};
      if(productId){
        let product = await productModel.findOne({
          _id: productId,
        });
        match.productId = product._id;
      }
      const aggregatorOpts = [
        {
          $addFields: {
            productId: "$productId",
          },
        },
        {
          $match: match,
        },
      ];
      productVariations = await productVariationModel.aggregate(aggregatorOpts).exec();

      await productModel.populate(
        productVariations,
        [
          {
            "path": "productId",
            "model": "productsCollection",
          },
          {
            "path": "attributes",
            "model": "Attribute",
          },
        ]
      );
    } else {
      // ======= for dropdown =========== (if no text, return all product variations)
      productVariations = await super.getList(req, productVariationModel, "");
    }

    if(productVariations.length > 0){
      return res.status(200).json({
        status: true,
        message: "Product variations fetched successfully",
        data: productVariations,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "No variatiosns found for this product.",
        data: [],
      });
    }
  });

  static addOrUpdateProductVariation = catchAsyncErrors(async (req, res, next) => {
    let { productId, attributes, _id } = req.body;
    attributes = JSON.parse(req.body.attributes);

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

    let fileName = "";
    if(req.files.image){
      let image = await fileUploaderSingle("./src/public/uploads/productVariationImages/", req.files.image);
      fileName = image.newfileName;
    }

    let data = {
      productId: productId,
      attributes: attributes || [],
    };
    if(fileName != ''){
      data.image = fileName
    }

    let checkExist = await super.getByCustomOptionsSingle(req, productVariationModel, {
      productId: productId,
      attributes: attributes || [],
    });

    if (!_id && checkExist) {
      return res.status(422).json({
        status: false,
        message: "Product variation already exists.",
        data: {},
      });
    }

    let updated =
      _id && _id != null && _id != ""
        ? await super.updateById(productVariationModel, _id.toString(), data)
        : await super.create(res, productVariationModel, data);

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

  static getProductVariationDetails = catchAsyncErrors(async (req, res, next) => {
    let { id } = req.body;
    let productVariation = await productVariationModel.findOne({ _id: id }).populate([
      {
        "path": "productId",
        "model": "productsCollection",
      },
      {
        "path": "attributes",
        "model": "Attribute",
      },
    ]);

    if (!productVariation) {
      return res.status(400).json({
        status: false,
        message: "No details found.",
        data: {},
      });
    }

    return res.status(200).json({
      status: true,
      message: "Product variation details fetched successfully",
      data: productVariation,
    });
  });

  static deleteProductVariation = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    const updated = await super.deleteById(productVariationModel, id);

    return res.status(200).json({
      status: true,
      message: "Successful",
      data: updated,
    });
  });
}

module.exports = ProductVariationController;
