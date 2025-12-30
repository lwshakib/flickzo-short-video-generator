import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ videoId: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { videoId } = await params;

        // 1. Check if the video exists and belongs to the user
        const video = await prisma.video.findUnique({
            where: {
                id: videoId,
                userId: session.user.id,
            },
        });

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // 2. If it's pending, send the cancel event to Inngest
        if (video.status === "PENDING") {
            await inngest.send({
                name: "video.canceled",
                data: {
                    videoId: video.id,
                },
            });
        }

        // 3. Delete the record from the database
        await prisma.video.delete({
            where: {
                id: videoId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting video:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete video" },
            { status: 500 }
        );
    }
}
