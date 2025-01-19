import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function GET() {
    // const writerEmail = await getWriterEmailFromSession()

    // if (!writerEmail) {
    //     return NextResponse.json({ success: false, message: "Unable to get writer." })
    // }

    try {
        // const findWriter = await prisma.writer.findUnique({
        //     where: { email: writerEmail }
        // })

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