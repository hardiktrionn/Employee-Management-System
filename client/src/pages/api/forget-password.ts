// pages/api/forget-password.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end("Method Not Allowed");

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/forget-password`, req.body, {
            withCredentials: true,
        });

        res.status(200).json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        res.status(status).json(message);
    }
}
