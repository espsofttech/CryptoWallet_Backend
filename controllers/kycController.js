const kycModel = require("../models/kycModel");
const { validationResult } = require("express-validator");
const userWalletModel = require("../models/userWalletModel");

const insertData = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    console.log('req.data', req.body)
    let image = !req.files["image"] ? null : req.files["image"][0].filename;
    if (image) {
      req.body.image = image;
    } else {
      req.body.image = req.body.old_profile_pic;
    }

    let userImage = !req.files["userImage"]
      ? null
      : req.files["userImage"][0].filename;
    if (!userImage || userImage == null || userImage == "null" || userImage == undefined || userImage == 'undefined') {
      req.body.userImage = req.body.old_userImage;
    } else {
      req.body.userImage = userImage;
    }

    let BankStatement = !req.files["BankStatement"] ? null : req.files["BankStatement"][0].filename;
    if (!BankStatement || BankStatement == null || BankStatement == "null" || BankStatement == undefined || BankStatement == 'undefined') {
      req.body.BankStatement = req.body.old_bankStatement;
    } else {
      req.body.BankStatement = BankStatement;
    }

    let data = {
      user_id: req.body.user_id,
      user_name: req.body.user_name,
      dob: req.body.dob,
      email: req.body.email,
      identity_proof_id: req.body.identity_proof_id,
      image: req.body.image,
      doc_no: req.body.doc_no,
      Address: req.body.Address,
      BankStatement: req.body.BankStatement,
      phoneNo: req.body.phoneNo,
      userImage: req.body.userImage,
    };

    const kycDetail = await kycModel.getKycDataById(req.body.user_id);

    let insert = "";

    if (kycDetail.length > 0) {
      insert = await kycModel.updateKycData(data);
    } else {
      insert = await kycModel.insertData(data);
    }
    if (insert) {
      var userActivity = {
        user_id: req.body.user_id,
        description: 'KYC Updated!!'
      }
      console.log('userActivity:', userActivity)
      let activity = await userWalletModel.insertActivity(userActivity);
      return res.status(201).send({ status: true, msg: "KYC Updated!" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getAllkyc = async (req, res) => {
  try {
    const getall = await kycModel.getAllkyc();
    if (getall) {
      return res
        .status(200)
        .send({ status: true, msg: "successfull", data: getall });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getKycById = async (req, res) => {
  try {
    let user_id = req.params.id;
    console.log(user_id);

    const getalldetail = await kycModel.getAllkycById(user_id);

    console.log(getalldetail, user_id);
    if (getalldetail) {
      return res
        .status(200)
        .send({ status: true, msg: "successfull", data: getalldetail[0] });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const UpdateSuccessKyc = async (req, res) => {
  console.log('UpdateSuccessKyc')
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    let user_id = req.body.user_id;
    let depositFiat = req.body.depositFiat;
    let depositCrypto = req.body.depositCrypto;

    const update = await kycModel.UpdateSuccessKyc(user_id);
    
    console.log('update:',update)
    if (update) {
      const insert = await kycModel.updatePaymentModule(user_id,depositFiat,depositCrypto);
      var userActivity = {
        user_id: req.body.user_id,
        description: 'KYC Approved!!'
      }
      console.log('userActivity:', userActivity)
      let activity = await userWalletModel.insertActivity(userActivity);

      return res
        .status(201)
        .send({ status: true, msg: "kyc accepted successfully by admin" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong try again later" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const rejectKyc = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }
    let user_id = req.params.user_id;
    const update = await kycModel.rejectKyc(user_id);
    if (update) {
      var userActivity = {
        user_id: req.params.user_id,
        description: 'KYC Reject!!'
      }
      console.log('userActivity:', userActivity)
      let activity = await userWalletModel.insertActivity(userActivity);
      return res
        .status(201)
        .send({ status: true, msg: "your kyc is rejected by admin" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Something went wrong try again later" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = {
  insertData,
  getAllkyc,
  getKycById,
  UpdateSuccessKyc,
  rejectKyc,
};
