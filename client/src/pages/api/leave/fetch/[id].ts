// pages/api/leave/fetch/[id].ts
import axiosInstance from "@/utils/axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') return res.status(405).end("Method Not Allowed");
    const { id } = req.query
    try {
        const response = await axiosInstance.get(`/leave/my/${id}`, {
            headers: {
                Cookie: req.headers.cookie || "",
            },
        });
        res.status(200).json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        res.status(status).json(message);
    }

}