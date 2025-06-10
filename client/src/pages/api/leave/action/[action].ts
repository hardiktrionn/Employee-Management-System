// pages/api/leave/action/[action].ts
import axiosInstance from "@/utils/axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'PUT') return res.status(405).end("Method Not Allowed");
    const { action } = req.query

    try {
        const response = await axiosInstance.put(`/leave/${action}`, req.body, {
            headers: {
                Cookie: req.headers.cookie || "",
            },
        })
        res.status(200).json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        res.status(status).json(message);
    }

}