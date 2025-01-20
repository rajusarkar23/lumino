import { db } from "@/db/db";
import { Blog, Writer } from "@/db/schema";
import { getWriterEmailFromSession } from "@/utils";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { content, title, slug, thumbnailImage, category } = await req.json()

    const writerEmail = await getWriterEmailFromSession()

    if (!writerEmail) {
        return NextResponse.json({ success: false, message: "Unable to get writer." })
    }

    try {
        const findWriter = await db.select().from(Writer).where(eq(Writer.email, writerEmail))

        if (findWriter.length === 1) {
            const createBlog = await db.insert(Blog).values({
                title,
                slug,
                thumbnailImage,
                content,
                category: "finance",
                writerId: findWriter[0].id
            })
            if (!createBlog) {
                return NextResponse.json({ success: false, message: "unable to create this blog" })

            }

            return NextResponse.json({ success: true, message: "Blog created.", createdBlog: createBlog })

        }

        if (!findWriter) {
            return NextResponse.json({ success: false, message: "Unable to find writer." })
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong." })

    }
}

export async function GET() {
    const writerEmail = await getWriterEmailFromSession()

    if (!writerEmail) {
        return NextResponse.json({ success: false, message: "Unable to get writer." })
    }

    try {
        const findWriter = await db.select().from(Writer).where(eq(Writer.email, writerEmail))

        if (findWriter.length === 1) {
            const fetchBlog = await db.select().from(Blog).where(eq(Blog.writerId, findWriter[0].id))

            if (fetchBlog.length === 0) {
                return NextResponse.json({ success: false, message: "no blogs found, unable to fetch blogs" })
            }

            return NextResponse.json({ success: true, message: "Fetched successfully,", blogs: fetchBlog })

        }

        return NextResponse.json({ success: false, message: "Unable to find writer." })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "something went wrong" })
    }
}