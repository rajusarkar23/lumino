import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = (formData.get("file") as File) || null;

  const s3Client = new S3Client({
    region: "auto",
    endpoint: `${process.env.CLOUDFLARE_ENDPOINT}`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
  });

  const files = [];

  const numsAndLetters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWSYZ1234567890";

  function generateFileName(l: number) {
    let strings = "";
    const length = numsAndLetters.length;

    for (let i = 0; i < l; i++) {
      const randonVal = Math.floor(Math.random() * length);

      strings += numsAndLetters[randonVal]
    }
    return strings
  }


  const fileName = generateFileName(20)

  const uploadParams = {
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type
  }

  await s3Client.send(new PutObjectCommand(uploadParams))
  const url = `${process.env.CLOUDFLARE_CDN_URL}/${fileName}`
  files.push({fileName})
  return NextResponse.json({success: true, message: "Upload success", url: url });

}
