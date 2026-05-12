/** Serialize image/binary inputs for Gemini `inlineData` (tmp/code_examples.md). */
export async function imageInputToBase64(
  input: Blob | Buffer | File | string
): Promise<string> {
  if (typeof input === "string") {
    return input.replace(/^data:image\/\w+;base64,/, "");
  }
  if (Buffer.isBuffer(input)) {
    return input.toString("base64");
  }
  if (input instanceof Blob) {
    const arrayBuffer = await input.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  }
  return "";
}
