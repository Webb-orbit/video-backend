import { User } from "../module/user.model.js";
import Apierr from "../utiles/apierr.js";
import Apiresponse from "../utiles/apires.js";
import { daleteoncloud, uploadoncloud } from "../utiles/cloud.js";
import { promisecontrole } from "../utiles/promise.js";
import { extractfileidFromUrl } from "../utiles/cloud.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccandRefreshtoken = async (userid) => {
    try {
        const client = await User.findById(userid)
        const access = client.generateAccesstoken()
        const refresh = client.generateAccesstoken()

        client.refreshtokan = refresh
        await client.save({ validateBeforeSave: false })

        return { access, refresh }
    } catch (error) {
        throw new Apierr(500, "something is wrong", error)
    }
}


const createuser = promisecontrole(async (req, res) => {
    console.log(req.files)

    const { username, fullname, email, password } = req.body

    if ([username, fullname, email, password].some((e) => e.trim() === "")) {
        throw new Apierr(400, "all filed are required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (user) {
        throw new Apierr(400, "email or username already exists");
    }

    const logopath = req.files?.logo[0]?.path;
    const bannerpath = req.files?.banner[0]?.path;


    if (!logopath) {
        throw new Apierr(400, "logopath is required");
    }

    const logo = await uploadoncloud(logopath)
    const banner = await uploadoncloud(bannerpath)

    if (!logo) {
        throw new Apierr(400, "logo is required");
    }

    const createduser = await User.create({
        email,
        username,
        password,
        fullname,
        logo: logo.url,
        banner: banner?.url || ""
    })

    const finaluser = await User.findById(createduser._id).select("-password -refreshtokan")

    if (!finaluser) {
        throw new Apierr(500, "server error try again");
    }

    return res.status(200)
        .json(new Apiresponse(200, { data: finaluser }, "new user are created"))
})


const loginuser = promisecontrole(async (req, res) => {
    const { username, email, password } = req.body
    console.log(username, email, password);


    if (!username && !email) {
        throw new Apierr(404, "username or email are required")
    }

    const userexisted = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!userexisted) {
        throw new Apierr(404, "user not found")
    }

    const ispassword = await userexisted.ispasswordcorrect(password)

    if (!ispassword) {
        throw new Apierr(401, "password not mached")
    }

    const { access, refresh } = await generateAccandRefreshtoken(userexisted._id)

    const updateduser = await User.findById(userexisted._id).select("-password -refreshtokan")

    return res.status(200)
        .cookie("accesstoken", access, options)
        .cookie("refreshtoken", refresh, options)
        .json(new Apiresponse(200, { user: updateduser, access, refresh }, "user logedin"))
})

const logoutuser = promisecontrole(async (req, res) => {
    await User.findByIdAndUpdate(
        req.client._id,
        {
            $unset: {
                refreshtokan: 1
            }
        }, { new: true }
    )

    res.status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new Apiresponse(200, {}, "user log outted"))
})

const updateuserpassword = promisecontrole(async (req, res) => {
    const { newpassword, oldpassword } = req.body

    if (!newpassword || !oldpassword) {
        throw new Apierr(401, "newpassword and oldpassword are requried")
    }
    const user = await User.findById(req.client._id)
    const ispasscorr = await user.ispasswordcorrect(oldpassword)

    if (!ispasscorr) {
        throw new Apierr(401, "oldpassword is wrong")
    }
    user.password = newpassword
    await user.save({ validateBeforeSave: false })

    res.status(200)
        .json(new Apiresponse(200, {}, "passwoed is updated"))

})

const getuser = promisecontrole(async (req, res) => {
    res.status(200)
        .json(new Apiresponse(200, { user: req.client }, "user is found"))
})

const updateuser = promisecontrole(async (req, res) => {
    const { email, fullname } = req.body
    if (!email && !fullname) {
        throw new Apierr(401, "email or fullname are required")
    }

    const updateduser = await User.findByIdAndUpdate(
        req.client._id,
        {
            $set: {
                email,
                fullname
            }
        }, { new: true }
    ).select("-password -refreshtokan")

    res.status(200)
        .json(new Apiresponse(200, { user: updateduser }, "user updated successfully"))
})

const updatelogo = promisecontrole(async (req, res) => {
    const logo = req.file.path
    if (!logo) {
        throw new Apierr(401, "file is required")
    }
    const updatedlogo = await uploadoncloud(logo)
    if (!updatedlogo.url) {
        throw new Apierr(500, "error on uploading file on server")
    }

    const nowupdatedlogo = await User.findByIdAndUpdate(
        req.client._id,
        {
            $set: {
                logo: updatedlogo.url
            }
        }, { new: true }
    ).select("-password -refreshtokan")

    const oldfileid = extractfileidFromUrl(req.client.logo)
    await daleteoncloud(oldfileid)

    res.status(200)
        .json(new Apiresponse(200, { user: nowupdatedlogo }, "logo updated successfully"))
})

const updatebanner = promisecontrole(async (req, res) => {
    const banner = req.file.path
    if (!banner) {
        throw new Apierr(401, "file is required")
    }
    const updatedbanner = await uploadoncloud(banner)
    if (!updatedbanner.url) {
        throw new Apierr(500, "error on uploading file on server")
    }

    const nowupdatedbanner = await User.findByIdAndUpdate(
        req.client._id,
        {
            $set: {
                banner: updatedbanner.url
            }
        }, { new: true }
    ).select("-password -refreshtokan")

    const oldfileid = extractfileidFromUrl(req.client.banner)
    await daleteoncloud(oldfileid)

    res.status(200)
        .json(new Apiresponse(200, { user: nowupdatedbanner }, "banner updated successfully"))
})

const userprofile = promisecontrole(async (req, res) => {
    const { username } = req.params
    if (!username) {
        throw new Apierr(500, "userid not found")
    }

    const profile = await User.aggregate([
        {
            $match: {
                username: username
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channal",
                as: "subscribers"
            }
        }, {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subcriber",
                as: "subscribed"
            }
        }, {
            $addFields: {
                subscripbercount: {
                    $size: "$subscribers"
                },
                isubscribed: {
                    $size: "$subscribed"
                },
                issubscribed: {
                    $cond: {
                        if: { $in: [req.client._id, "$subscribers.subcriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        }, {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                issubscribed: 1,
                isubscribed: 1,
                subscripbercount: 1,
                logo: 1,
                banner: 1
            }
        }
    ])

    console.log('profile->', profile)
    if (!profile?.length) {
        throw new Apierr(500, "profile not found")
    }

    res.status(200)
        .json(new Apiresponse(200, profile[0], "user profile"))

})

const getwatchistory = promisecontrole(async (req, res) => {
    const watchistory = await User.aggregate([
        {
            $match: {
                _id: req.client._id
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchistory",
                foreignField: "_id",
                as: "watchistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        email: 1,
                                        logo: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    res.status(200)
        .json(new Apiresponse(200, watchistory, "watch history"))
})
export {
    createuser,
    loginuser,
    logoutuser,
    updateuserpassword,
    getuser,
    updateuser,
    updatelogo,
    updatebanner,
    userprofile,
    getwatchistory
}