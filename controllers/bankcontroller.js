const { validationResult } = require("express-validator");

const bankModel = require("../models/bankModel");

const insertDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    let user_id = req.params.id
    console.log(user_id)
    const insert = await bankModel.inserBankDetails(req.body,user_id);
    console.log(insert)
    if (insert) {
      return res
        .status(201)
        .send({ status: true, msg: "bank details updated successfully" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { insertDetails };
