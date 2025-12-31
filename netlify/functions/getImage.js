import { getStore } from "@netlify/blobs";

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");

  const store = getStore("images");

  const base64 = await store.get(id);

  return new Response(
    Buffer.from(base64, "base64"),
    { headers: { "Content-Type": "image/gif" } }
  );
};
