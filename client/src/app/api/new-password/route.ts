// api/logout.ts
import axiosInstance from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

    try {
         const body = await req.json();
        const response = await axiosInstance.post(`/auth/new-password`, body);

        return NextResponse.json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        return NextResponse.json(message, { status });
    }
}
