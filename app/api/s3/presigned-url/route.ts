import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { path, contentType } = await req.json();

    if (!path || !contentType) {
      return NextResponse.json(
        { error: "path and contentType are required" },
        { status: 400 }
      );
    }

    // Basic sanitization: Ensure path does not contain path traversal sequences
    if (path.includes("..") || path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const presignedUrl = await getPresignedUploadUrl(path, contentType);

    return NextResponse.json({ url: presignedUrl, path });
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
