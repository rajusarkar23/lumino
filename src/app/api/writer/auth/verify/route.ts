import { getWriterEmailFromJWTVerifySession } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const { otp } = await req.json()
    console.log(otp);

    const writerEmailId = await getWriterEmailFromJWTVerifySession()
    if (!writerEmailId) {
        return NextResponse.json({ success: false, message: "Unable to verify." })
    }
    try {
        const findWriter = await prisma.writer.findUnique({
            where: { email: writerEmailId }
        })

        if (!findWriter) {
            return NextResponse.json({ success: false, message: "No writer found.." })
        }

        const compare = bcrypt.compareSync(otp, findWriter.otp)
        console.log(compare);

        if (!compare) {
            return NextResponse.json({ success: false, message: "Wrong OTP." })
        }

        const updateWriter = await prisma.writer.update({
            where: { email: findWriter.email },
            data: { isVerified: true }
        })

        if (!updateWriter) {
            return NextResponse.json({ success: false, message: "Unable change verify field, try again.." })

        }

        const jwt_token = jwt.sign({ writerEmailId: findWriter.email }, `${process.env.WRITER_SESSION_SECRET}`);
        (await cookies()).set("session", jwt_token)

        return NextResponse.json({ success: true, message: "Verified successfully", writerEmail: updateWriter.email })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Something went wrong." })

    }
}