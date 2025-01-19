import { getWriterEmailFromSession } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const { content, title, slug, thumbnailImage } = await req.json()

    const writerEmail = await getWriterEmailFromSession()
    console.log(writerEmail);
    
    if (!writerEmail) {
        return NextResponse.json({ success: false, message: "Unable to get writer." })
    }

    try {
        const findWriter = await prisma.writer.findUnique({
            where: { email: writerEmail }
        })

        if (!findWriter) {
            return NextResponse.json({ success: false, message: "Unable to find writer." })
        }

        const createBlog = await prisma.blog.create({
            data: {
                title,
                slug,
                thumbnailImage,
                content,
                writer: {
                    connect: { id: findWriter.id }
                }
            }
        })
        if (!createBlog) {
            return NextResponse.json({ success: false, message: "unable to create this blog" })

        }

        return NextResponse.json({ success: true, message: "Blog created.", createdBlog: createBlog })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong." })

    }
}