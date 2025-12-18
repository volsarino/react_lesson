import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("gif-images");
  const id = new URL(req.url).searchParams.get("id");

  const data = await store.get(id);

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(data, {
    headers: { "Content-Type": "image/gif" },
  });
};
