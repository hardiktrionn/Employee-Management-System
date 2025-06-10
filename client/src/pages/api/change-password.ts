handler
import type { NextApiRequest, NextApiResponse } from 'next';
import axiosInstance from '../../utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end("Method Not Allowed");

    try {
        const response = await axiosInstance.post(`/auth/change-password`, req.body, {
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
