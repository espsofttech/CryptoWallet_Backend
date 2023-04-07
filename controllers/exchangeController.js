const transactionModel = require("../models/transactionModel");
const userWalletModel = require("../models/userWalletModel");
const { validationResult } = require("express-validator");

const exchange = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        status: false,
        msg: `${errors.errors[0].msg}`,
      });
    }

    let user_id= req.body.user_id;
    let type = req.body.type;
    let amount = req.body.amount;
    let coin_id = req.body.coin_id;
    let coinId = req.body.buyCoin_Id;
    let buyAmount = req.body.buyAmount;

    let checkBalance = await userWalletModel.checkBalance(req.body);

    if (checkBalance[0].balance >= amount) {
      let checkDataById = await userWalletModel.checkDataById1(user_id);

      if (checkDataById.length >= 0) {
        console.log('user_idin_idamount', user_id,
          coin_id,
          amount)
        let deductAmt = await userWalletModel.updateBalancebyid(
          user_id,
          coin_id,
          amount
        );
        if (deductAmt) {
          let updatWallet = await userWalletModel.Balancebyid(
            user_id,
            coinId,
            buyAmount
          );
          if (updatWallet) {
            const insertIntoTransaction =
              await transactionModel.insertDetails(req.body);
            if (insertIntoTransaction) {
              var userActivity = {
                user_id: user_id,
                description: type == 1 ? 'Buy Successfull!!' : 'Sell Successfull!!'
              }
              console.log('userActivity:', userActivity)
              let activity = await userWalletModel.insertActivity(userActivity);
              return res.status(201).send({
                status: true,
                msg: "successfully",
                data: "Order placed successfully",
              });
            } else {
              return res
                .status(400)
                .send({ status: false, msg: "Something went wrong" });
            }
          } else {
            return res
              .status(400)
              .send({ status: false, msg: "Something went wrong" });
          }
        } else {
          return res
            .status(400)
            .send({ status: false, msg: "Something went wrong" });
        }
      } else {
        return res
          .status(404)
          .send({ status: false, msg: "No user found by this id " });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Insufficient balance" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const getcryptovalue = async (req, res) => {
  try {
    const getcryptovalue = await userWalletModel.getcryptovalue();
    if (getcryptovalue) {
      return res
        .status(200)
        .send({ status: true, msg: "crypt value fetched successfully", data: getcryptovalue });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "something went wrong" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updatelivecryptovalue = async (req, res) => {
  try {
    console.log("calling");
    // console.log(req.body);

    const updatelivecryptovalue = await userWalletModel.updatelivecryptovalue(req.body);
    if (updatelivecryptovalue) {
      return res
        .status(200)
        .send({ status: true, msg: "crypt value fetched successfully"
        // , data: getcryptovalue 
      });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "something went wrong" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};

const updatecryptovalue = async (req, res) => {
  try {
    console.log("calling");
    console.log(req.body);
    if (req.body.type == 0){
      req.body.percentage =0
    }
    const updatecryptovalue = await userWalletModel.updatecryptovalue(req.body);
    if (updatecryptovalue) {
      return res
        .status(200)
        .send({ status: true, msg: "crypto value fetched successfully"
      });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "something went wrong" });
    }
  } catch (err) {
    // console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { exchange, getcryptovalue , updatelivecryptovalue , updatecryptovalue };
