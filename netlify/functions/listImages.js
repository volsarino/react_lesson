import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("images");

  const keys = [];
  for await (const key of store.list()) {
    keys.push(key);
  }

  return new Response(JSON.stringify(keys));
};
