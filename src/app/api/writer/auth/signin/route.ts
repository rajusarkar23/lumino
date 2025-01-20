import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { db } from "@/db/db";
import { Writer } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    try {
        const findWriter = await db.select().from(Writer).where(eq(Writer.email, email))
        if (findWriter.length === 1) {
            const compare = bcrypt.compareSync(password, findWriter[0].password)
            if (!compare) {
                return NextResponse.json({ success: false, message: "Wrong password." })
            }

            const jwt_token = jwt.sign({ writerEmailId: findWriter[0].email }, `${process.env.WRITER_SESSION_SECRET}`);
            (await cookies()).set("session", jwt_token)
            return NextResponse.json({ success: true, message: "Login success", writerEmail: findWriter[0].email })
        }
        return NextResponse.json({ success: false, message: "Email is not registered." })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong." })
    }
}