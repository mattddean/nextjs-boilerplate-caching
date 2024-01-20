import { unstable_cache } from "next/cache";

export const runtime = "edge";
export const fetchCache = "default-no-store";

export default async function Home() {
  const result = unstable_cache(
    async () => {
      console.time("revalidate edge-unstable-cache");
      await new Promise((r) => setTimeout(r, 5000));
      console.timeEnd("revalidate edge-unstable-cache");
      return "edge-unstable-cache";
    },
    ["edge-unstable-cache"],
    {
      revalidate: 10,
    }
  );
  const hi = await result();

  return <main>{hi}</main>;
}
