import mongoose, { Document } from "mongoose";

interface Category extends Document {
    name: string,
    banner: string
}

const postSchema = new mongoose.Schema<Category>({
    name: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.model("category", postSchema)