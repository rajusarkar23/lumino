import { db } from "@/db/db";
import { Blog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest){
    const {id} = await req.json() 

    try {
        const getBlogByIdAndDelete = await db.delete(Blog).where(eq(Blog.id, id))
        console.log(getBlogByIdAndDelete);
        return NextResponse.json({message: "Deleted"})
    } catch (error) {
        console.log(error);
        
    }
}