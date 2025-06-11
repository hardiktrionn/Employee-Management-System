// api/verify-link.ts
import axiosInstance from '@/utils/axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    try {
        const response = await axiosInstance.get(`/auth/verify-link?email=${email}`);

      return NextResponse.json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
       return NextResponse.json(message,{status});
    }
}
