// pages/api/employee/delete/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import axiosInstance from "../../../../utils/axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'DELETE') return res.status(405).end("Method Not Allowed");

    try {
        const response = await axiosInstance.delete(`/employee/${req.query.id}`, {
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