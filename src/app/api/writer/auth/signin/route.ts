import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    try {
        const findWriter = await prisma.writer.findUnique({
            where: { email }
        })
        if (!findWriter) {
            return NextResponse.json({ success: false, message: "Email is not registered." })
        }
        const compare = bcrypt.compareSync(password, findWriter.password)
        if (!compare) {
            return NextResponse.json({ success: false, message: "Wrong password." })
        }

        const jwt_token = jwt.sign({writerEmailId: findWriter.email}, `${process.env.WRITER_SESSION_SECRET}`);
        (await cookies()).set("session", jwt_token)

        return NextResponse.json({success: true, message: "Login success", writerEmail: findWriter.email})
    } catch (error) {

    }
}