import { getStore } from "@netlify/blobs";

export default async (req) => {
  // ← これが重要（JSON.parse は不要）
  const { id, data } = await req.json();

  const store = getStore("images");

  await store.set(id, data);

  const base64 = data.split(",")[1];

  await store.set(id, base64);
  
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
};
