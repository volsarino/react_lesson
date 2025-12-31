import { getStore } from "@netlify/blobs";

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");

  const store = getStore("images");

  // ★ Blobs に保存してある Base64 を取得
  const base64 = await store.get(id);

  if (!base64) {
    return new Response("Not Found", { status: 404 });
  }

  // ★ Base64 → バイナリ変換
  const buffer = Buffer.from(base64, "base64");

  return new Response(buffer, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "public, max-age=31536000"
    }
  });
};
