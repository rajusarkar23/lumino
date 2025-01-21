import { generateOTP } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";
import { db } from "@/db/db";
import { Writer } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  try {
    const writerExists = await db.select().from(Writer).where(eq(Writer.email, email))

    if (writerExists.length !== 0) {
      console.log(" writer found");
      return NextResponse.json({ success: false, message: "Writer already exists" })
    }

    // nodemailer credentials
    const sender = process.env.EMAIL;
    const mailPassword = process.env.EMAIL_PASSWORD;
    // nodemailer transporte
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: sender,
        pass: mailPassword,
      },
    });
    // otp generate
    const otp = generateOTP(6)
    console.log(otp);
    // password and otp hash
    const hashedPassword = bcrypt.hashSync(password, 10)
    const hashedOTP = bcrypt.hashSync(otp, 10)
    // create writer
    const newWriter = await db.insert(Writer).values({
      email,
      password: hashedPassword,
      otp: hashedOTP
    }).returning()

    if (newWriter.length === 1) {
      const jwtToken = jwt.sign({ writerEmailId: email }, `${process.env.WRITER_OTP_VERIFY_SECRET}`, {expiresIn:"30d"}
      );
      (await cookies()).set("otp-verify-session", jwtToken)
      //send mail
      await transporter.sendMail({
        from: sender,
        to: email,
        replyTo: sender,
        subject: `Verification OTP`,
        html: `
           <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0; margin: 0; width: 100%; height: 100%;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" style="width: 100%; height: 100%; background-color: #f4f4f4; text-align: center;">
            <tr>
              <td style="padding: 40px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center;">
                  <tr>
                    <td>
                      <h2 style="color: #333333; margin-bottom: 20px;">Here is your OTP</h2>
                      <p style="font-size: 16px; color: #555555; margin-bottom: 20px;">Welcome onboard, Please verify your email with the below OTP.</p>
                      <p style="font-size: 18px; color: #333333; margin-bottom: 30px;"><strong>OTP: ${otp}</strong></p>
                      <p style="font-size: 16px; color: #555555; margin-bottom: 20px;">From: ${sender}</p>
                      <p style="font-size: 14px; color: #777777;">This is an automated message, please do not reply.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>`,
      });
      return NextResponse.json({ success: true, message: "Writer created successfully.", writerEmail: newWriter[0].email })
    }
    return NextResponse.json({ success: false, message: "Unable to create your account, please try again." })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Something went wrong." })
  }
}