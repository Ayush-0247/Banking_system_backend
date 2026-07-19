import express from "express";
import * as authMiddleware from "../middleware/auth.middleware.js";
import * as accountController from "../controllers/account.controller.js";


const router = express.Router()



/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)


/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController)


/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)


/**
 * Show All Accounts Of A User
 * - GET /api/accounts/showallaccountofauser
 */
router.get("/showallaccountofauser", authMiddleware.authMiddleware, accountController.showallaccountofauser)


/**
 * Delete A Account Of A User , user Should BE loggedIn
 * - GET /api/accounts/deleteaccountofauser
 */
router.post("/deleteaccountofauser", authMiddleware.authMiddleware, accountController.deleteaccountofauser)





/**
 * - POST /api/accounts/deposit
 * - Deposit money into an account
 * - Protected Route
 */
router.post("/deposit", authMiddleware.authMiddleware, accountController.depositMoneyController)



/**
 * - POST /api/accounts/withdraw
 * - Withdraw money from an account
 * - Protected Route
 */
router.post("/withdraw", authMiddleware.authMiddleware, accountController.withdrawMoneyController)

export default router;