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

type Props = {
  videoData: any;
};

function RemotionComposition({ videoData }: Props) {
  const captions = videoData?.captions || [];
  const images = videoData?.images || [];
  const imageList = images.map((img: any) => typeof img === 'string' ? img : img.url);
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const duration =
    captions.length > 0
      ? captions[captions.length - 1]?.end * fps
      : 300; // Default to 10 seconds if no captions



  const getCurrentCaption = () => {
    const currentTime = frame / fps;
    const currentCaption = captions.find(
      (item: any) => currentTime >= item?.start && currentTime <= item?.end
    );
    return currentCaption ? currentCaption?.word : "";
  };

  return (
    <div className="bg-black w-full h-full">
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
            <Sequence key={index} from={startTime} durationInFrames={sceneDuration}>
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
          color: "white",
          justifyContent: "center",
          bottom: 100,
          height: 250,
          textAlign: "center",
          position: "absolute",
          left: 0,
          right: 0,
          top: undefined,
          fontSize: 60,
          zIndex: 10,
          textShadow: "0px 0px 20px rgba(0,0,0,0.8)",
          padding: "0 40px"
        }}
        className={videoData?.captionStyle?.className}
      >
        <h2 className="font-extrabold uppercase tracking-tighter drop-shadow-2xl">
          {getCurrentCaption()}
        </h2>
      </AbsoluteFill>
      {videoData.audio?.audioUrl && <Audio src={videoData.audio.audioUrl} />}
    </div>
  );
}

export default RemotionComposition;
