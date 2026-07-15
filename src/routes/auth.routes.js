import express from "express";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router()


/* POST /api/auth/register */
router.post("/register", authController.userRegisterController)


/* POST /api/auth/login */
router.post("/login",authController.userLoginController)

/**
 * - POST /api/auth/logout
 */
router.post("/logout", authController.userLogoutController)


router.post("/deleteuser", authController.deleteUserController)


// Public Routes for forget password and set new password
// forgaet password api return otp, whic otp is send in reset password api to set new password
router.post("/forgot-password", authController.forgotPasswordController);

router.post("/reset-password", authController.resetPasswordController);



export default router;