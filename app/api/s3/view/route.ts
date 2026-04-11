import { NextResponse } from "next/server";
import { s3Service } from "@/services/s3.services";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "path is required" },
        { status: 400 }
      );
    }

    const signedUrl = await s3Service.getSignedUrl(path);

    // Redirect the browser to the signed URL so image tags load natively
    return NextResponse.redirect(signedUrl);
  } catch (error) {
    console.error("Error redirecting to S3 signed URL", error);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}
