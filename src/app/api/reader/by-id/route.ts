import { db } from "@/db/db";
import { Blog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id } = await req.json()

    try {
        const findById = await db.select().from(Blog).where(eq(Blog.id, id))
        console.log(findById);
        return NextResponse.json({ message: "Ok" })
    } catch (error) {
        console.log(error);
    }
}