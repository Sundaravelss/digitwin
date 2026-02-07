export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return Buffer.from(binary, "binary").toString("base64");
}

export async function fileToDataUrl(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = arrayBufferToBase64(buffer);
  const mime = file.type || "application/octet-stream";
  return `data:${mime};base64,${base64}`;
}
