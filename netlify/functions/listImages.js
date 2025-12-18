import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("gif-images");
  const keys = [];

  for await (const key of store.keys()) {
    keys.push(key);
  }

  return new Response(JSON.stringify(keys), {
    headers: { "Content-Type": "application/json" },
  });
};
