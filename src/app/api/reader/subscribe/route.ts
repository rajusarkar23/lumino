import { db } from "@/db/db"
import { Subscribers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { email } = await req.json()
    if (!email) {
        return NextResponse.json({ success: false, message: "Email is undefined, try again." })
    }

    try {
        const findSubscriber = await db.select().from(Subscribers).where(eq(Subscribers.email, email))

        if (findSubscriber.length !== 0) {
            return NextResponse.json({ success: false, message: "This email already registered." })
        }

        const createSubscriber = await db.insert(Subscribers).values({
            email
        }).returning()

        console.log(createSubscriber[0]);
        return NextResponse.json({success: true, message: "Subsribe success"})
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: "Something went wrong, try agin"})
    }
}