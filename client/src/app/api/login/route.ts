// api/login/route.ts

import axiosInstance from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await axiosInstance.post(`/auth/login`, body, {
            headers: {
                Cookie: req.headers.get('cookie') || "",
            },
        });

        const setCookie = response.headers['set-cookie'];
        const nextResponse = NextResponse.json(response.data, { status: 200 });

        if (setCookie) {
            nextResponse.headers.set('Set-Cookie', setCookie.toString());
        }

        return nextResponse;
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { server: "Server error" };

        return NextResponse.json(message, { status });
    }
}
