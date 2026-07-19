import accountModel from "../models/account.model.js";
import * as emailService from "../services/email.service.js";
import mongoose from "mongoose";

async function createAccountController(req, res) {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
}

async function getUserAccountsController(req, res) {
  const accounts = await accountModel.find({ user: req.user._id });

  res.status(200).json({
    accounts,
  });
}

async function getAccountBalanceController(req, res) {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  const balance = await account.getBalance();

  res.status(200).json({
    accountId: account._id,
    balance: balance,
  });
}

async function showallaccountofauser(req, res) {
  const accounts = await accountModel.find({ user: req.user._id });
  res.status(200).json({
    accounts,
  });
}

async function deleteaccountofauser(req, res) {
  try {
    const { id } = req.body;

    const account = await accountModel.findById(id);

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    if (account.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this account",
      });
    }

    await account.deleteOne();

    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function depositMoneyController(req, res) {
  const { accountId, amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: "Invalid amount",
    });
  }

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  account.balance += Number(amount);

  await account.save();

  await emailService.sendDepositEmail(
    req.user.email,
    req.user.name,
    amount,
    account.accountNumber, // only if this field exists
  );

  return res.status(200).json({
    message: "Money deposited successfully",
    balance: account.balance,
  });
}

async function withdrawMoneyController(req, res) {
  const { accountId, amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: "Invalid amount",
    });
  }

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  if (account.balance < amount) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  account.balance -= Number(amount);

  await account.save();

  res.status(200).json({
    message: "Money withdrawn successfully",
    balance: account.balance,
  });

  await emailService.sendWithdrawEmail(
    req.user.email,
    req.user.name,
    amount,
    account.accountNumber, // only if this field exists
  );
}

async function transferMoneyController(req, res) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { fromAccountId, toAccountId, amount } = req.body;

    const transferAmount = Number(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const sender = await accountModel
      .findOne({
        _id: fromAccountId,
        user: req.user._id,
      })
      .session(session);

    if (!sender) {
      throw new Error("Sender account not found");
    }

    const receiver = await accountModel
      .findOne({
        _id: toAccountId,
      })
      .session(session);

    if (!receiver) {
      throw new Error("Receiver account not found");
    }

    // if (sender._id.equals(receiver._id)) {
    //     throw new Error("Cannot transfer to the same account");
    // }

    if (sender.balance < transferAmount) {
      throw new Error("Insufficient balance");
    }

    sender.balance -= transferAmount;
    receiver.balance += transferAmount;

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: "Transfer successful",
      senderBalance: sender.balance,
    });
  } catch (err) {
    await session.abortTransaction();

    res.status(400).json({
      message: err.message,
    });
  } finally {
    session.endSession();
  }
}

export {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
  showallaccountofauser,
  deleteaccountofauser,
  depositMoneyController,
  withdrawMoneyController,
  transferMoneyController,
};
