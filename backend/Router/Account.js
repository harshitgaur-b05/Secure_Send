import express from 'express';
import authMiddleware from "../middleware.js";
import { Account } from "../db.cjs";
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import JWT_SECRET from '../config.js';

const router = express.Router();

// Route to create a new account
router.post("/create", async (req, res) => {
    const { token, initialBalance } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { userID } = decoded;
        
        // Check if an account already exists for this user
        const existingAccount = await Account.findOne({ userId: userID });

        if (existingAccount) {
            return res.status(400).json({
                message: "Account already exists"
            });
        }

        // Create a new account
        const newAccount = new Account({
            userId: userID,
            balance: initialBalance || 0
        });
        
        // Save the account to the database
        await newAccount.save();

        res.status(201).json({
            message: "Account created successfully",
            account: newAccount
        });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({
            message: "An error occurred while creating the account",
            error: error.message
        });
    }
});

// Route to check balance
router.get("/balance", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { userID } = decoded;

        // Find the user's account by userID
        const account = await Account.findOne({ userId: userID });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

// Route for transferring funds
router.post("/transfer", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        const { userID } = decoded;
        
        const { amount, to } = req.body;

        // Input validation
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount. Amount must be a positive number." });
        }

        const account = await Account.findOne({ userId: userID }).session(session);

        if (!account) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Account not found"
            });
        }

        if (account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid recipient account"
            });
        }

        // Proceed with the transfer
        await Account.updateOne({ userId: userID }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error during transfer:", error);
        res.status(500).json({
            message: "An error occurred during the transfer",
            error: error.message
        });
    }
});

export default router;
