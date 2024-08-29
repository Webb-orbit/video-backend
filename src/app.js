import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORGINE,
    credentials: true
}))

app.use(cookieParser())
app.use(express.json({limit:"50kb"}))
app.use(express.urlencoded({limit: "50kb", extended: true}))
app.use(express.static("public"))

import userrouter from "./routes/user.router.js"
import videorouter from "./routes/video.router.js"
import likerouter from "./routes/likes.router.js"
import tweetrouter from "./routes/tweet.router.js"
import commentrouter from "./routes/comment.router.js"
import playlistrouter from "./routes/playlist.router.js"
app.use("/api/v1/user", userrouter)
app.use("/api/v1/video", videorouter)
app.use("/api/v1/like", likerouter)
app.use("/api/v1/tweet", tweetrouter)
app.use("/api/v1/comm", commentrouter)
app.use("/api/v1/playlist", playlistrouter)


export {app}