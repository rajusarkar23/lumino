import { getWriterEmailFromJWTVerifySession } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { db } from "@/db/db";
import { Writer } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
    const { otp } = await req.json()
    console.log(otp);

    const writerEmailId = await getWriterEmailFromJWTVerifySession()
    console.log(writerEmailId);

    if (!writerEmailId) {
        return NextResponse.json({ success: false, message: "Unable to verify." })
    }
    try {
        const findWriter = await db.select().from(Writer).where(eq(Writer.email, writerEmailId))
        console.log(findWriter);

        if (findWriter.length === 1) {
            const compare = bcrypt.compareSync(otp, findWriter[0].otp)
            console.log(compare);
            if (!compare) {
                return NextResponse.json({ success: false, message: "Wrong OTP." })
            }
            const updateWriter = await db.update(Writer).set({ isVerified: true }).where(eq(Writer.email, findWriter[0].email)).returning()
            if (updateWriter.length === 1) {
                console.log(updateWriter);
                const jwt_token = jwt.sign({ writerEmailId: updateWriter[0].email }, `${process.env.WRITER_SESSION_SECRET}`);
                (await cookies()).set("session", jwt_token)
                return NextResponse.json({ success: true, message: "Verified successfully", writerEmail: updateWriter[0].email })
                
            }
        }
        return NextResponse.json({ success: false, message: "Unable change verify field, try again.." })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong." })

    }
}