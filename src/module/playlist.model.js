import { Schema, model } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


const playlistschema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

playlistschema.plugin(aggregatePaginate)

export const Playlist = model("Playlist", playlistschema)