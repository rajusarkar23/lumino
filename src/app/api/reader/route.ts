import { db } from "@/db/db";
import { Blog } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const getAll = await db.select().from(Blog)
        if (!getAll) {
            return NextResponse.json({success: false, message: "Unable to fetch blogs."})
        }
        return NextResponse.json({success: true, blogs: getAll})
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: "Something went wrong."})
    }
}