import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

/**
 * RemotionRoot component.
 * This is the entry point for Remotion where all video compositions
 * are registered with their technical specifications (FPS, duration, dimensions).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 
        The "Empty" composition serves as a base for video rendering.
        - durationInFrames: Total length of the video in frames.
        - fps: Frames per second.
        - width/height: Video resolution (e.g., 720p).
      */}
      <Composition
        id="Empty"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
