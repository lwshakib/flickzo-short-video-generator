import { NextResponse } from "next/server";
import { s3Service } from "@/services/s3.services";

export async function POST(req: Request) {
  try {
    const { path } = await req.json();

    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    const signedUrl = await s3Service.getSignedUrl(path);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating signed URL", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
