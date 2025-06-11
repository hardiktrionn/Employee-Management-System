// api/leave/fetch-all.ts
import axiosInstance from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {


    try {
        const response = await axiosInstance.get(`/leave/all`, {
            headers: {
                Cookie: req.headers.get('cookie') || "",
            },
        });


        // Forward the cookie from Express to browser
        const setCookie = response.headers['set-cookie'];

        const nextResponse = NextResponse.json(response.data, { status: 200 });

        if (setCookie) {
            nextResponse.headers.set('Set-Cookie', setCookie.toString());
        }


        return NextResponse.json(response.data);
    } catch (error: any) {

        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        return NextResponse.json(message,{status});
    }
}