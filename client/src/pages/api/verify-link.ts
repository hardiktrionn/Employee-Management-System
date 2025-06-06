// pages/api/verify-link.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axiosInstance from '../../utils/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).end("Method Not Allowed");

    try {
        const response = await axiosInstance.get(`/auth/verify-link?email=${req.query.email}`);

        res.status(200).json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        res.status(status).json(message);
    }
}
