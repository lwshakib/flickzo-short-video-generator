/** Map numeric canvas size to Gemini `imageConfig.aspectRatio`. */
export function dimensionsToGeminiAspectRatio(
  width: number,
  height: number
): string {
  if (width <= 0 || height <= 0) return "1:1";

  const r = width / height;
  const nearest = (
    pairs: readonly { label: string; value: number }[]
  ): string => {
    let best = pairs[0]!;
    let bestDiff = Math.abs(r - best.value);
    for (const p of pairs) {
      const d = Math.abs(r - p.value);
      if (d < bestDiff) {
        best = p;
        bestDiff = d;
      }
    }
    return best.label;
  };

  return nearest([
    { label: "1:1", value: 1 },
    { label: "9:16", value: 9 / 16 },
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
    { label: "3:4", value: 3 / 4 },
  ]);
}
