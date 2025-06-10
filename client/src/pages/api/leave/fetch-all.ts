// pages/api/leave/fetch-all.ts
import axiosInstance from "@/utils/axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end("Method Not Allowed");

    try {
        const response = await axiosInstance.get(`/leave/all`, {
            headers: {
                Cookie: req.headers.cookie || "",
            },
        });


        // Forward the cookie from Express to browser
        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }

        res.status(200).json(response.data);
    } catch (error: any) {

        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        res.status(status).json(message);
    }
}