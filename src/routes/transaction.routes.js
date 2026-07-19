// import { Router } from 'express';
// import * as authMiddleware from '../middleware/auth.middleware.js';
// import * as transactionController from "../controllers/transaction.controller.js";

// const transactionRoutes = Router();

// /**
//  * - POST /api/transactions/
//  * - Create a new transaction
//  */

// transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)


// /**
//  * - POST /api/transactions/system/initial-funds
//  * - Create initial funds transaction from system user
//  */
// transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

// export default transactionRoutes;

import { Router } from "express";
import { getAllTransactionsController , getMyTransactionsController } from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();


// for all tranactions;
router.get("/", getAllTransactionsController);

// for transaction of users only
router.get("/user", authMiddleware, getMyTransactionsController);

export default router;