import { generateOTP } from "@/utils";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    try {
        // check if writer already exist
        const writerExists = await prisma.writer.findUnique({
            where: { email }
        })
        if (writerExists) {
            return NextResponse.json({ success: false, message: "Writer already exists with this email." })
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
        const newWriter = await prisma.writer.create({
            data: {
                email,
                password: hashedPassword,
                otp: hashedOTP,
            }
        })
        if (!newWriter) {
            return NextResponse.json({ success: false, message: "Unable to create your account, please try again." })
        }
        const jwtToken = jwt.sign({ writerEmailId: newWriter.email }, `${process.env.WRITER_OTP_VERIFY_SECRET}`
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
        return NextResponse.json({ success: true, message: "Writer created successfully.", writerEmail: newWriter.email })
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: "Something went wrong."})
    }

}