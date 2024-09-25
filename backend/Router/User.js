import express from "express";
import zod from "zod";
import { User } from "../db.cjs";
import jwt from "jsonwebtoken";
import JWT_SECRET from "../config.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().min(3).max(30).trim().toLowerCase(),
    firstname: zod.string().min(1).max(50).trim(),
    lastname: zod.string().min(1).max(50).trim(),
    password: zod.string().min(6),
    email: zod.string(),
    
});

router.post("/signup", async (req, res) => {
    console.log(req.body)
    const body = req.body;
    const zodinput = signupSchema.safeParse(body);
    console.log(zodinput.success)

    if (!zodinput.success) {
        return res.status(400).json({
            msg: "Your input is incorrect",
            errors: zodinput.error.flatten().fieldErrors,
        });
    }

    const userExists = await User.findOne({ username: body.username });
    if (userExists) {
        return res.status(400).json({
            msg: "Username already exists",
        });
    }

    const dbuser = await User.create(body);
    const token = jwt.sign({ userID: dbuser._id }, JWT_SECRET);

    res.json({
        msg: "User created successfully",
        token: token,
    });
});























const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const zodinput = signinSchema.safeParse(body);

    if (!zodinput.success) {
        return res.status(400).json({
            msg: "Your input is incorrect",
            errors: zodinput.error.flatten().fieldErrors,
        });
    }

    const user = await User.findOne({ username: body.username });
    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password",
        });
    }

    // Here you should validate the password
    const isPasswordValid = user.password === body.password; // Replace with a proper hash check
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid username or password",
        });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
        token: token,
    });
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
    const result = updateBody.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Error while updating information",
            errors: result.error.flatten().fieldErrors,
        });
    }

    await User.updateOne({ _id: req.userId }, { $set: req.body });

    res.json({
        message: "Updated successfully",
    });
});














router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
//     console.log(filter);
// const users=await User.find();
// console.log(users)
    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })
    console.log(users)

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})





export default router