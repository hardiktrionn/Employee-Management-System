// pages/api/leave/edit/[id].ts
import axiosInstance from "@/utils/axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'PUT') return res.status(405).end("Method Not Allowed");
    const { id } = req.query
    try {
        const response = await axiosInstance.put(`/leave/edit/${id}`, req.body, {
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