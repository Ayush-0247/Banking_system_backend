import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "FROZEN", "CLOSED"],
        default: "ACTIVE"
    },
    currency: {
        type: String,
        default: "INR"
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

accountSchema.index({ user: 1, status: 1 })



const accountModel = mongoose.model("account", accountSchema)



export default accountModel;