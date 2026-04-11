import { NextResponse } from "next/server";
import { s3Service } from "@/services/s3.services";

export async function POST(req: Request) {
  try {
    const { path, contentType } = await req.json();

    if (!path || !contentType) {
      return NextResponse.json(
        { error: "path and contentType are required" },
        { status: 400 }
      );
    }

    const presignedUrl = await s3Service.getPresignedUploadUrl(
      path,
      contentType
    );

    return NextResponse.json({ url: presignedUrl, path });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
