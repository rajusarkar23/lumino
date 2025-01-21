import { db } from "@/db/db";
import { Blog, Writer } from "@/db/schema";
import { getWriterEmailFromSession } from "@/utils";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const writerEmail = await getWriterEmailFromSession()

    if (!writerEmail) {
        return NextResponse.json({ success: false, message: "Unable to get writer." })
    }

    try {
        const findWriter = await db.select().from(Writer).where(eq(Writer.email, writerEmail))

        if (findWriter.length === 1) {
            
        }

        // if (!findWriter) {
        //     return NextResponse.json({ success: false, message: "Unable to find writer." })
        // }

        const fetchBlog = await prisma.blog.findMany({})

        if (!fetchBlog) {
            return NextResponse.json({success: false, message: "unable to fetch blogs"})
        }

        return NextResponse.json({success: true, message: "Fetched successfully,", blogs: fetchBlog})

       
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: "something went wrong"})
    }
}