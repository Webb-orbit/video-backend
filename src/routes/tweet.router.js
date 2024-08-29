import { Router } from "express";
import { addtweet, deleteusertweet, getonetweet, getusertweets, updatetweet } from "../controllers/tweet.control.js";
import { varifyjwt } from "../middleware/user.middle.js";

const router = Router()

router.use(varifyjwt)

router.route("/add").post(addtweet)
router.route("/gettweets/:creatorid").get(getusertweets)
router.route("/update/:tweetid").patch(updatetweet)
router.route("/delete/:tweetid").delete(deleteusertweet)
router.route("/getone/:tweetid").get(getonetweet)

export default router