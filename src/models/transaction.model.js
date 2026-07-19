import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      default: "SUCCESS",
    },
    idempotencyKey: {
      type: String,
    },
    type: {
      type: String,
      enum: ["TRANSFER", "DEPOSIT", "WITHDRAW"],
      default: "TRANSFER",
    },
  },
  { timestamps: true }
);
transactionSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
export default mongoose.model("Transaction", transactionSchema);