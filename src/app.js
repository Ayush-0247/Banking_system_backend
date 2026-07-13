import express from "express";
import cookieParser from "cookie-parser";
import morgan from 'morgan';


const app = express();
app.use(morgan('dev'));


app.use(express.json());
app.use(cookieParser());

import authRouter from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";


app.get("/", (req, res) => {
    res.send("Ledger Service is up and running");
});

app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRoutes);

export default app;