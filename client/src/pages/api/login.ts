// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axiosInstance from '../../utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end("Method Not Allowed");
    try {
        const response = await axiosInstance.post(`/auth/login`, req.body);

        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            res.setHeader('Set-Cookie', setCookie);
        }

        res.status(200).json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { server: "Server error" };
        res.status(status).json(message);
    }
}
