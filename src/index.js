import dotenv from "dotenv"
import app from "./app.js"
import connectdb from "./db/dbconnect.js"

dotenv.config({ path: "./.env" })  

const port = process.env.PORT || 3000;

connectdb()
 .then(() => {
  app.listen(port,() =>{
    console.log(`App is listning on ${port}`)
  })//This line creates server
 })
 .catch((err) => {
  console.error("MongoDB connection error",err)
  process.exit(1)
 })
