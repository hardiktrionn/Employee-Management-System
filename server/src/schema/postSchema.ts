import mongoose, { Document } from "mongoose";

interface Post extends Document {
    title: string,
    description: string
    prompt: string
    category: mongoose.Schema.Types.ObjectId
    view: number
    tags: string[]
}

const postSchema = new mongoose.Schema<Post>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    view: {
        type: Number,
        default: 0
    },
    tags: [String]
}, {
    timestamps: true
})

export default mongoose.model("post", postSchema)