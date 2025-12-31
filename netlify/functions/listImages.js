import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("images");

  const keys = [];

  for await (const entry of store.list()) {
    keys.push(entry.key);
  }

  return new Response(JSON.stringify(keys), {
    headers: { "Content-Type": "application/json" }
  });
};
