import { Router } from "express";
import { varifyjwt } from "../middleware/user.middle.js";
import { addcomment, deletecomment, getcomments, mycomments, updatecomment } from "../controllers/comment.control.js";

const router = Router()

router.use(varifyjwt)

router.route("/add/:videoid").post(addcomment)
router.route("/update/:commentid").patch(updatecomment)
router.route("/delete/:videoid").delete(deletecomment)
router.route("/get/:videoid").get(getcomments)
router.route("/getmycomment").get(mycomments)


export default router