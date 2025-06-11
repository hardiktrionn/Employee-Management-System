// api/attendance/fetch/[id]/route.ts
import axiosInstance from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

/**
 * Fetch the user attendance using thief id
 * the attendance fetch between this month first date to current date
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const {id} = await params;

    try {
        const response = await axiosInstance.get(`/attendance/user/${id}?startDate=${startDate}&endDate=${endDate}`, {
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
