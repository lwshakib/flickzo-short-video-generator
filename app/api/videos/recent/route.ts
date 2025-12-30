import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const videos = await prisma.video.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5, // Limit to recent 5
        });

        return NextResponse.json(videos);
    } catch (error: any) {
        console.error("Error fetching recent videos:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch recent videos" },
            { status: 500 }
        );
    }
}
