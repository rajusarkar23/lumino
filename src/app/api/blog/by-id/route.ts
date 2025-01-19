import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const { id } = await req.json()
    const to = Number(id)
    console.log(typeof to);
    

    try {
        const fetchBlogById = await prisma.blog.findUnique({
            where: { id: to }
        })
        console.log(fetchBlogById);
        return NextResponse.json({success: true, message: "Fetched successsfully", fetchBlogById})
    } catch (error) {
        console.log(error);

    }
}