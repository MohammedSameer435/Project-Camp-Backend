import express from "express"
const app= express()
import cors from "cors"
import cookieParser from "cookie-parser"

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods: ["Get", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders:["Content-Type", "Authorization"]
}))

import healthcheckrouter from "./routes/healthcheck.routes.js"
import authrouter from "./routes/auth.routes.js"
app.use("/api/v1/healthcheck", healthcheckrouter)
app.use('/api/v1/auth', authrouter)
app.get("/" ,(req,res) =>{
    res.send("welcome to basecamp")
})
export default app
