import { createuser, getuser, getwatchistory, loginuser, logoutuser, updatebanner, updatelogo, updateuser, updateuserpassword, userprofile } from "../controllers/user.control.js";
import { Router } from "express";
import { uploadfile } from "../middleware/uploadfile.js";
import { varifyjwt } from "../middleware/user.middle.js";

const router = Router();
router.route("/createuser").post(uploadfile.fields([{name: 'logo'}, {name: 'banner'}]), createuser);
router.route("/loginuser").post(loginuser);
router.route("/logout").get(varifyjwt, logoutuser);
router.route("/updatepassword").patch(varifyjwt, updateuserpassword);
router.route("/getcurrentuser").get(varifyjwt, getuser);
router.route("/updateuser").patch(varifyjwt, updateuser);
router.route("/updatelogo").patch(varifyjwt, uploadfile.single('logo'), updatelogo);
router.route("/updatebanner").patch(varifyjwt, uploadfile.single('banner'), updatebanner);

router.route("/profile/:username").get(varifyjwt, userprofile);
router.route("/watchistory").get(varifyjwt, getwatchistory);

export default router