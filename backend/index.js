import express from "express";
import dotenv from "dotenv"
import mainRouter from "./Router/mainRouter.js"
import cors from "cors"

const app =express();

app.use(cors());
app.use(express.json())
dotenv.config();

app.use("/api/v1",mainRouter)




app.listen(process.env.PORT,()=>{
    console.log("connected to backend")
})