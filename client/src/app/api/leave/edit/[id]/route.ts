// api/leave/edit/[id].ts
import axiosInstance from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest,{params}:{ params: Promise<{ id: string }> }) {


    try {
         const body = await req.json();
        const {id}=await params
        const response = await axiosInstance.put(`/leave/edit/${id}`, body, {
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