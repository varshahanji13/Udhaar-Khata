import { CustomerModel } from "../models/CustomerModel.js";
import { TransactionModel } from "../models/TransactionModel.js";
import generatePDF from "../services/pdfService.js";

export const downloadStatement = async (req, res) => {
  try {

    const customer = await CustomerModel.findById(
      req.params.customerId
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    const transactions =
      await TransactionModel.find({
        customerId: req.params.customerId
      });

    generatePDF(
      customer,
      transactions,
      res
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};