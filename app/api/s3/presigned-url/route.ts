import { NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const { path, contentType } = await req.json();

    if (!path || !contentType) {
      return NextResponse.json(
        { error: "path and contentType are required" },
        { status: 400 }
      );
    }

    const presignedUrl = await getPresignedUploadUrl(path, contentType);

    return NextResponse.json({ url: presignedUrl, path });
  } catch (error) {
    // Attempt to extract values from body if possible or use defaults
    console.error("Failed to generate presigned URL:", { error });
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
