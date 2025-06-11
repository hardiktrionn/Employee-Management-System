// api/forget-password.ts
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export default async function POST(req: NextRequest) {

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_HOST}/auth/forget-password`, req.body, {
            withCredentials: true,
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        return NextResponse.json(message, {status})
    }
}
