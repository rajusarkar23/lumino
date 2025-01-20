import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// generate OTP
export function generateOTP(n: number) {
    let otp = ""
    for (let i = 0; i < n; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp
}

// get user from session
export async function getWriterEmailFromJWTVerifySession() {
    console.log("ram");
    
    const cookie = (await cookies()).get("otp-verify-session")?.value
    console.log(cookie);
    
    if (!cookie) {
        return NextResponse.json({ success: false, message: "No session found." })
    }

    const decode = jwt.verify(cookie, `${process.env.WRITER_OTP_VERIFY_SECRET}`)

    if (!decode) {
        return NextResponse.json({ success: false, message: "Unable to decode the session." }
        )
    }
    //@ts-expect-error. email id exists in the session, i know
    const writerEmail = decode.writerEmailId
    return writerEmail
}

export async function getWriterEmailFromSession() {
    const cookie = (await cookies()).get("session")?.value
    if (!cookie) {
        return NextResponse.json({ success: false, message: "No session found." })
    }

    const decode = jwt.verify(cookie, `${process.env.WRITER_SESSION_SECRET}`)

    if (!decode) {
        return NextResponse.json({ success: false, message: "Unable to decode the session." }
        )
    }
    //@ts-expect-error. email id exists in the session, i know
    const writerEmail = decode.writerEmailId
    return writerEmail
}