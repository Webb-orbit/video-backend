import { v2 } from "cloudinary"
import { log } from "console";
import fs from "fs"

v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

function extractfileidFromUrl(url) {
    const regex = /\/([^/]+)\.(jpg|jpeg|png|gif|bmp|svg|webp|mp4|mkv|mov|avi|wmv|flv|webm)$/i;
    const match = url.match(regex);    
    return match ? match[1] : null;
}

const uploadoncloud = async (filepath) => {
    try {
        if (!filepath) return null
        const res = await v2.uploader.upload(filepath, {
            resource_type: "auto"
        })
        fs.unlinkSync(filepath)
        return res
    } catch (error) {
        console.log("lllll",error)
        fs.unlinkSync(filepath)
        return null
    }
}

const daleteoncloud = async (publicid) => {
    try {
        if (!publicid) return null
        await v2.uploader.destroy(publicid, (err, res) => {
            if (err) {
                console.error('Error deleting image:', err);
                return null
            } else {
                console.log('Image deleted successfully:', res);
                return res
            }
        })
    } catch (error) {
        return null
    }
}
const dvideooncloud = async (publicid) => {
    try {
        if (!publicid) return null
        let aa = await v2.uploader.destroy(publicid,{
            resource_type: "video"
        })
        console.log(aa);
        return aa
    } catch (error) {
        return null
    }
}


export { extractfileidFromUrl, uploadoncloud, daleteoncloud, dvideooncloud }