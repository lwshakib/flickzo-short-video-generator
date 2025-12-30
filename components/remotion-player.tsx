"use client";
import { Player } from "@remotion/player";
import RemotionComposition from "./remotion-composition";
type Props = {
  videoData: any;
};

function RemotionPlayer({ videoData }: Props) {
  const fps = 30;
  const captions = videoData.captions || [];
  const durationInFrames = captions.length > 0
    ? Math.max(Number((captions[captions.length - 1]?.end * fps).toFixed(0)), 30)
    : 300; // 10 seconds default

  return (
    <Player
      component={RemotionComposition}
      durationInFrames={durationInFrames}
      compositionWidth={720}
      compositionHeight={1280}
      fps={fps}
      controls
      style={{
        width: "100%",
        height: "100%",
      }}
      inputProps={{
        videoData: videoData,
      }}
    />
  );
}


export default RemotionPlayer;
