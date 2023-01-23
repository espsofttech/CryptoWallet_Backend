const transactionModel = require("../models/transactionModel");

const getAllTransactionDetail = async (req, res) => {
  try {
    const getAllDetails = await transactionModel.getAllTransactionDetail();
    if (getAllDetails.length > 0) {
      return res
        .status(200)
        .send({ status: true, msg: " successful", data: getAllDetails });
    } else {
      return res.status(400).send({ status: false, msg: "no deatils found" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { getAllTransactionDetail };
