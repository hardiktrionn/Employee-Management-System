import mongoose, { Document } from "mongoose";

interface Contact extends Document {
    name: string,
    email: string
    phone?: string
    reason: "general" | "support" | "partnership" | "sales" | "other"
    comment: string
}

const contactSchema = new mongoose.Schema<Contact>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
})

export default mongoose.model("contact", contactSchema)