import { Request, Response } from "express";
import * as Yup from "yup"
import Contact from "../schema/contactSchema"

// Contact field validate schema
const contactValidation = Yup.object({
    name: Yup.string().required("Name is Required"),
    email: Yup.string().email("Enter Valid Email").required("Email is Required"),
    phone: Yup.string(),
    reason: Yup.string().required("Select Option is Required"),
    comment: Yup.string().required("Comment is Required")
})

export const createRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        // validate the contact request data
        await contactValidation.validate(req.body);
        console.log(req.body)
        // insert into db
        const data = await Contact.create({
            ...req.body
        });

        res.status(200).json({ success: true, message: "Request Sendned", data });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Error creating Contact Request",
            error: err.errors || err.message,
        });
    }
}
export const getAllRequest = async (req: Request, res: Response): Promise<void> => {
    try {

        // find all contact Requests data
        const data = await Contact.find();

        res.status(200).json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Error creating Contact Request",
            error: err.errors || err.message,
        });
    }
}
export const getRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        // find single contact Request data
        const data = await Contact.findById(id);

        if (!data) {
            res.status(404).json({ success: false, message: "Request not found" })
            return
        }

        res.status(200).json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Error creating Contact Request",
            error: err.errors || err.message,
        });
    }
}
