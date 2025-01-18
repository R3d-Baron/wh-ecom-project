const BaseController = require("./BaseController");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const RequestHandler = require("../utils/RequestHandler");
const pricingModel = require("../models/pricingModel");
const productVariationModel = require("../models/productVariationModel");

const requestHandler = new RequestHandler();

class PricingController extends BaseController {
  constructor() {
    super();
  }

  static listPricing = catchAsyncErrors(async (req, res, next) => {
    let { variationId, } = req.body;
    let pricing;

    if (req.method === "POST") {
      let match = {};
      if(variationId){
        let productVariation = await productVariationModel.findOne({
          _id: variationId,
        });
        match.variationId = productVariation._id;
      }
      const aggregatorOpts = [
        {
          $addFields: {
            variationId: "$variationId",
          },
        },
        {
          $match: match,
        },
      ];
      pricing = await pricingModel.aggregate(aggregatorOpts).exec();
    } else {
      pricing = await super.getList(req, pricingModel, {});
    }


    if(pricing.length > 0){
      return res.status(200).json({
        status: true,
        message: "Pricelist fetched successfully",
        data: pricing,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "No pricings found.",
        data: [],
      });
    }
  });

  static addOrUpdatePricing = catchAsyncErrors(async (req, res, next) => {
    let { variationId, price, discount, _id } = req.body;

    if (!variationId || !price) {
      return res.status(422).json({
        status: false,
        message: "variationId and price is required.",
        data: {},
      });
    }

    let data = { 
      variationId: variationId,
      price: price,
      discount: discount,
    };

    let checkExist = await super.getByCustomOptionsSingle(req, pricingModel, {
      variationId: variationId,
    });

    if (!_id && checkExist) {
      return res.status(422).json({
        status: false,
        message: "Pricing info for this variation already added.",
        data: {},
      });
    }
    let updated =
      _id && _id.trim()
        ? await super.updateById(pricingModel, _id, data)
        : await super.create(res, pricingModel, data);

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

  static getPricingDetails = catchAsyncErrors(async (req, res, next) => {
    let { id } = req.body;

    let pricing = await pricingModel.findOne({ _id: id });

    if (!pricing) {
      return res.status(400).json({
        status: false,
        message: "No details found.",
        data: {},
      });
    }

    return res.status(200).json({
      status: true,
      message: "Pricing details fetched successfully",
      data: pricing,
    });
  });

}

module.exports = PricingController;
