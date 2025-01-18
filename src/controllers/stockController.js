const BaseController = require("./BaseController");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const RequestHandler = require("../utils/RequestHandler");
const stockModel = require("../models/stockModel");
const productVariationModel = require("../models/productVariationModel");

const requestHandler = new RequestHandler();

class StockController extends BaseController {
  constructor() {
    super();
  }

  static listStocks = catchAsyncErrors(async (req, res, next) => {
    let stocks = [];
    const { variationId } = req.body;

    if (req.method == "POST") {
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
      stocks = await stockModel.aggregate(aggregatorOpts).exec();
      // await productVariationModel.populate(
      //   stocks,
      //   [
      //     {
      //       "path": "variationId",
      //       "model": "ProductVariation",
      //     },
      //   ]
      // );
    } else {
      // ======= for dropdown =========== (if no text, return all stocks)
      stocks = await super.getList(req, stockModel, "");
    }

    if(stocks.length > 0){
      return res.status(200).json({
        status: true,
        message: "Stock fetched successfully",
        data: stocks,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "No stocks found.",
        data: [],
      });
    }
  });

  static addOrUpdateStock = catchAsyncErrors(async (req, res, next) => {
    let { variationId, quantity, _id } = req.body;

    let data = {
      variationId: variationId,
      quantity: quantity?? quantity,
    };

    let checkExist = await super.getByCustomOptionsSingle(req, stockModel, {
      variationId: variationId,
    });

    if (!_id && checkExist) {
      return res.status(422).json({
        status: false,
        message: "Stock info for this variation already added.",
        data: {},
      });
    }
    let updated =
      _id && _id != null && _id != ""
        ? await super.updateById(stockModel, _id.toString(), data)
        : await super.create(res, stockModel, data);

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

  static getStockDetails = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    const stock = await stockModel.findOne({ _id: id });

    if (!stock) {
      return res.status(400).json({
        status: false,
        message: "No details found.",
        data: {},
      });
    }

    return res.status(200).json({
      status: true,
      message: "Stock details fetched successfully",
      data: stock,
    });
  });

  static deleteStock = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    const updated = await super.deleteById(stockModel, id);

    return res.status(200).json({
      status: true,
      message: "Successful",
      data: updated,
    });
  });
}

module.exports = StockController;
