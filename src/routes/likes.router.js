import { Router } from "express";
import { varifyjwt } from "../middleware/user.middle.js";
import { allikedvideo, togglecommentlike, toggletweetlike, togglevideolike } from "../controllers/like.control.js";

const router = Router()
router.use(varifyjwt)

router.route("/video/:videoid").get(togglevideolike)
router.route("/tweet/:tweetid").get(toggletweetlike)
router.route("/comment/:commentid").get(togglecommentlike)
router.route("/likedvideos").get(allikedvideo)


export default router