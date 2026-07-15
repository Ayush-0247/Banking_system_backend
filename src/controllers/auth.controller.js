import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import * as emailService from "../services/email.service.js";
import tokenBlackListModel from "../models/blackList.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
* - user register controller
* - POST /api/auth/register
*/
async function userRegisterController(req, res) {
    const { email, password, name } = req.body

    const isExists = await userModel.findOne({
        email: email
    })

    if (isExists) {
        return res.status(422).json({
            message: "User already exists with email.",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email, user.name)
}

/**
 * - User Login Controller
 * - POST /api/auth/login
  */

async function userLoginController(req, res) {
    const { email, password } = req.body

    //"+password" will select the password field as well coz in schema we have select: false for password means password will not be selected to send unless we asked , that is by "+password" we ask to send password too.
    //
    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })

}


/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}

/**
 * - User Delete Controller
 * - POST /api/auth/deleteuser
 * ONLY FOR DEVELOPMENT AND TESTING PURPOSE
  */

async function deleteUserController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel
      .findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid password",
      });
    }

    await userModel.findByIdAndDelete(user._id);

    res.clearCookie("token");

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
}


async function forgotPasswordController(req, res) {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpires =
        Date.now() + 10 * 60 * 1000;

    await user.save();

    await emailService.sendOTPEmail(
        user.email,
        user.name,
        otp
    );

    res.json({
        message: "OTP sent successfully."
    });
}

async function resetPasswordController(req, res) {

    const { email, otp, newPassword } = req.body;

    const user = await userModel
        .findOne({ email })
        .select("+password");

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user.resetPasswordOTPExpires < Date.now()) {
        return res.status(400).json({
            message: "OTP expired"
        });
    }

    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    if (hashedOTP !== user.resetPasswordOTP) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    user.password = newPassword;

    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save();

     await emailService.sendNewPasswordSetEmail(
        user.email,
        user.name,
    );

    res.json({
        message: "Password updated successfully."
    });
}


export {
    userRegisterController,
    userLoginController,
    userLogoutController,
    deleteUserController,
    forgotPasswordController,
    resetPasswordController
};