// api/change-password/route.ts

import axiosInstance from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Read request body
        const body = await req.json();

        // Read cookies from request
        const cookie = req.headers.get('cookie') || '';

        // Make the API call to Express server
        const response = await axiosInstance.post(`/auth/change-password`, body, {
            headers: { Cookie: cookie },
        });

        // Forward the Set-Cookie header if available
        const setCookie = response.headers['set-cookie'];

        const nextResponse = NextResponse.json(response.data, { status: 200 });

        if (setCookie) {
            nextResponse.headers.set('Set-Cookie', setCookie.toString());
        }

        return nextResponse;
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        return NextResponse.json(message, { status });
    }
}
