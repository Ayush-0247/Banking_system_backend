import express from "express";
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import cors from 'cors';


const app = express();
app.use(morgan('dev'));

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"],
    credentials: true
}));

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