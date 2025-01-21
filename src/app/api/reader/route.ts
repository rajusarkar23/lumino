import { db } from "@/db/db";
import { Blog } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const getAll = await db.select().from(Blog)
        console.log(getAll.length);
        return NextResponse.json({success: true, blogs: getAll})
    } catch (error) {
        
    }
}