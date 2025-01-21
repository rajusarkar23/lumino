import { db } from "@/db/db";
import { Blog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id } = await req.json()

    try {
        const findById = await db.select().from(Blog).where(eq(Blog.id, id))
        if (typeof findById !== "object") {
            return NextResponse.json({success: false, message: "Unable fetch blog."})
        }
        
        return NextResponse.json({ success: true, blog: findById })
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: "Something went wrong."})
    }
}