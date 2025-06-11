// api/leave/fetch/[id].ts
import axiosInstance from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }) {

    try {
        const response = await axiosInstance.get(`/leave/my/${params.id}`, {
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