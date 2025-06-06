// pages/api/attendance/fetch/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import axiosInstance from "../../../../utils/axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') return res.status(405).end("Method Not Allowed");
    const { startDate, endDate, id } = req.query
    try {
        const response = await axiosInstance.get(`/attendance/user/${id}?startDate=${startDate}&endDate=${endDate}`, {
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