import { unstable_cache } from "next/cache";

export const revalidate = 0;

export default async function Home() {
  const result = unstable_cache(
    async () => {
      console.time("revalidating");
      await new Promise((r) => setTimeout(r, 5000));
      console.timeEnd("revalidating");
      return "test";
    },
    ["test"],
    {
      revalidate: 10,
    }
  );
  const hi = await result();

  return <main>{hi}</main>;
}
