// api/leave/edit/[id].ts
import axiosInstance from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest,{params}) {


    try {
        const response = await axiosInstance.put(`/leave/edit/${params.id}`, req.body, {
            headers: {
                Cookie: req.headers.get('cookie') || "",
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "Server error" };
        return NextResponse.json(message);
    }

}