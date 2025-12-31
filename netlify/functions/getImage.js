import { getStore } from "@netlify/blobs";

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");
  const store = getStore("images");

  const blob = await store.get(id);

  if (!blob) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(blob, {
    headers: {
      "Content-Type": "image/gif"
    }
  });
};
