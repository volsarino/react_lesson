import { getStore } from "@netlify/blobs";

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");

  const store = getStore("images");
  const data = await store.get(id);

  // dataURL → base64 部分だけ取り出す
  const base64 = data.split(",")[1];

  // base64 → バイナリ変換
  const buffer = Buffer.from(base64, "base64");

  return new Response(buffer, {
    headers: { "Content-Type": "image/gif" }
  });
};
