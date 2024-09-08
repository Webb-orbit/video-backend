import dbconnect from "./db/index.js"
import dotenv from "dotenv"
import { app } from "./app.js"
dotenv.config({
    path: "./env"
})

//hellou
dbconnect()
.then((e)=>{
app.listen(process.env.PORT, (req, res)=>{
    console.log(`server is connect on ${process.env.PORT}`);
})
})
.catch((err)=>{
    console.log(`monsodb connect failed ${err}`)
})