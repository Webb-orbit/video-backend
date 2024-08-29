import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, './public')
    },
    filename: function (req, file, cd) {
        cd(null, `${Date.now()}-${file.originalname}`)
    },
})

export const uploadfile = multer({storage,})