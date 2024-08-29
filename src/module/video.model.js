import { model, Schema } from "mongoose"
import aggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoschema = new Schema({
    videofile:{
        type: String,
        required: true
    },
    thumnail:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    ispublic:{
        type: Boolean,
        default: true
    },
    duration:{
        type: Number,
        required: true
    },
    views:{
        type: Number,
        default: 0
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
}, { timestamps: true })

videoschema.plugin(aggregatePaginate)

export const Video = model("Video", videoschema)