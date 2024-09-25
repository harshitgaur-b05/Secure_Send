import express from "express";
import UserRouter from "./User.js"
import accountRouter from "./Account.js"
// import AccountRouter from"./Account.js"
const router=express.Router();
router.use("/user",UserRouter)
// router.use("/account",AccountRouter)

router.use("/account", accountRouter);



export default router;