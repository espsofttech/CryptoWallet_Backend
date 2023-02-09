const transactionModel = require("../models/transactionModel");
var speakeasy = require('speakeasy');
const userWalletModel = require("../models/userWalletModel");

const getAllTransactionDetail = async (req, res) => {
  try {
    let user_id = req.params.user_id;

    const getAllDetails = await transactionModel.getAllTransactionDetail(user_id);
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


const getAllWithdrawTransactionsbyuser = async (req, res) => {
  try {
    let user_id = req.params.user_id;

    const getAllList = await transactionModel.getAllWithdrawTransactionsbyuser(user_id);
    if (getAllList) {
      return res.status(200).send({ status: true, data: getAllList });
    } else {
      return res.status(400).send({
        status: false,
        msg: "Something went wrong",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getQR = async (req, res) => {

  try {

    var user_id = req.params.user_id;

    const getQr = await transactionModel.getQr(user_id);
    if (getQr) {
      return res.status(200).send({ status: true, data: getQr[0] });
    } else {
      return res.status(400).send({
        status: false,
        msg: "Something went wrong",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
}


const twoAuthenticationVerify = async (req, res) => {
  try {

    var user_id = req.body.user_id;
    var userToken = req.body.SecretKey;
    var enableTwoFactor = req.body.enableTwoFactor;
    const getQr = await transactionModel.getQr(user_id);
    var abc = getQr[0].googleAuthCode;
    var tokenValidates = speakeasy.totp.verify({
      secret: abc,
      encoding: 'base32',
      token: userToken,
      window: 0
    });

    if (tokenValidates) {
      const getQrData = await transactionModel.updateUsersAuth(enableTwoFactor, user_id);
      var userActivity = {
        user_id: user_id,
        description: '2FA updated!!'
      }
      let activity = await userWalletModel.insertActivity(userActivity);

      res.status(200).send({
        success: true,
        msg: "Result",
        response: tokenValidates
      });

    } else {
      res.status(400).send({
        success: false,
        msg: "Token misMatch"
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
}

const userActivity = async (req, res) => {

  try {

    var user_id = req.params.user_id;

    const userActivity = await transactionModel.userActivity(user_id);
    console.log('userActivity',userActivity)
    if (userActivity) {
      return res.status(200).send({ status: true, notificationCount : userActivity.result2[0].cnt, data: userActivity.result});
    } else {
      return res.status(400).send({
        status: false,
        msg: "Something went wrong",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
}

module.exports = { getAllTransactionDetail, getAllWithdrawTransactionsbyuser, getQR, twoAuthenticationVerify,userActivity };
