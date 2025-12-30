import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { videoVoices } from "@/lib/data";
import { VideoDetailsView } from "@/components/video-details-view";

export default async function VideoDetailsPage({
    params,
}: {
    params: Promise<{ videoId: string }>;
}) {
    const { videoId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return notFound();
    }

    const video = await prisma.video.findUnique({
        where: {
            id: videoId,
            userId: session.user.id,
        },
    });

    if (!video) {
        return notFound();
    }

    const voiceData = videoVoices.find(v => v.Model === video.voice);

    return (
        <VideoDetailsView
            initialVideo={JSON.parse(JSON.stringify(video))}
            voiceData={voiceData}
        />
    );
}

