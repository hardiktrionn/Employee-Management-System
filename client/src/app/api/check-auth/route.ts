// app/api/check-auth/route.ts

import axiosInstance from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const cookie = req.headers.get('cookie') || '';
        // const { data: token } = useSession()

        const response = await axiosInstance.get(`/auth`, {
            headers: { Cookie: cookie  },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };

        return NextResponse.json(message, { status });
    }
}
