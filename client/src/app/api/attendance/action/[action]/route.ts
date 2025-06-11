// /api/attendance/action/[action]/route.ts

/**
 * perform the attendance action  
 * actions:checkin,checkout,breakin,breakout
 * */ 
import axiosInstance from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { action: string } }) {

    try {
        const response = await axiosInstance.get(`/attendance/${params.action}`, {
            headers: {
                Cookie: req.headers.get('cookie') || "",
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        return NextResponse.json(message, { status });
    }

}