const userWalletModel = require("../models/userWalletModel");
const { validationResult } = require("express-validator");
const withdrawalModel = require("../models/withdrawalModel");

const withdrawBtc = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    let amount = req.body.amount;

    const checkBalance = await userWalletModel.checkBalance(req.body);
    let balance = checkBalance[0].balance;

    if (balance >= amount) {
      let withdraw = await userWalletModel.withdrawBtc(req.body);
      if (withdraw) {
        let insertWithdrawalDetails = await withdrawalModel.insertDetails(
          req.body
        );

        if (insertWithdrawalDetails) {
          let updateStatus = await withdrawalModel.updateStatus(req.body);
          if (updateStatus) {
            return res.status(201).send({
              status: true,
              msg: "withdraw successfull and data in withdraw list inserted",
            });
          } else {
            return res.status(400).send({
              status: false,
              msg: "something went wrong",
            });
          }
        } else {
          return res.status(400).send({
            status: false,
            msg: "data not inserted in withdrawal list ",
          });
        }
      } else {
        return res
          .status(400)
          .send({ status: false, msg: "withdrawal failed" });
      }
    } else {
      return res.status(400).send({
        status: false,
        msg: "you dont have sufficient amout to withdraw",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, Error: err.message });
  }
};

const getAllList = async (req, res) => {
  try {
    const getAllList = await withdrawalModel.getAllList();
    if (getAllList) {
      return res.status(200).send({ status: true, data: getAllList });
    } else {
      return res.status(400).send({
        status: false,
        msg: "something went wrong",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }

    let checkUserByid = await withdrawalModel.checkUserByid(req.body);

    if (checkUserByid.length > 0) {
      const updateStatus = await withdrawalModel.updateStatus1(req.body);
      console.log(updateStatus);
      if (updateStatus) {
        return res
          .status(201)
          .send({ status: true, msg: "status updated successfully" });
      } else {
        return res
          .status(200)
          .send({ status: false, msg: "something went wrong" });
      }
    } else {
      return res
        .status(404)
        .send({
          status: false,
          msg: " no user found by this user and coin id",
        });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { withdrawBtc, getAllList, updateStatus };
