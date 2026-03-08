"use client";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cn } from "@/lib/utils";

interface Caption {
  start: number;
  end: number;
  word: string;
}

interface VideoData {
  captions?: Caption[];
  images?: (string | { url: string })[];
  audio?: {
    audioUrl: string;
  };
  captionStyle?: {
    className?: string;
  };
}

type Props = {
  videoData: VideoData;
};

function RemotionComposition({ videoData }: Props) {
  const captions = videoData?.captions || [];
  const images = videoData?.images || [];
  const imageList = images.map((img) =>
    typeof img === "string" ? img : img.url
  );
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const duration =
    captions.length > 0 ? captions[captions.length - 1]?.end * fps : 300; // Default to 10 seconds if no captions

  const getCurrentCaption = () => {
    const currentTime = frame / fps;
    const currentCaption = captions.find(
      (item) => currentTime >= item?.start && currentTime <= item?.end
    );
    return currentCaption ? currentCaption?.word : "";
  };

  return (
    <div className="h-full w-full bg-black">
      <AbsoluteFill>
        {imageList.map((url: string, index: number) => {
          const startTime = (index * duration) / imageList.length;
          const sceneDuration = duration / imageList.length;
          const scale = interpolate(
            frame,
            [startTime, startTime + sceneDuration],
            [1, 1.2],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <Sequence
              key={index}
              from={startTime}
              durationInFrames={sceneDuration}
            >
              <AbsoluteFill>
                <Img
                  src={url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale})`,
                  }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          bottom: 100,
          height: 250,
          zIndex: 10,
        }}
      >
        <div
          className={cn(
            "text-white text-center drop-shadow-2xl px-10 text-[60px]", // Essential Base Styles
            videoData?.captionStyle?.className
          )}
          style={{
            lineHeight: 1.1,
          }}
        >
          {getCurrentCaption()}
        </div>
      </AbsoluteFill>
      {videoData.audio?.audioUrl && <Audio src={videoData.audio.audioUrl} />}
    </div>
  );
}

export default RemotionComposition;
