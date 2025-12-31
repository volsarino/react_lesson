import { getStore } from "@netlify/blobs";

export default async (req) => {
  const { id, data } = JSON.parse(req.body);

  const store = getStore("images");

  await store.set(id, data);

  return new Response(JSON.stringify({ ok: true }));
};
