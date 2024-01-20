import styles from "./page.module.css";
import { unstable_cache } from "next/cache";

export const runtime = "edge";
export const fetchCache = "default-no-store";

export default async function Home() {
  const result = unstable_cache(
    async () => {
      console.time("revalidate edge-unstable-cache");
      await new Promise((r) => setTimeout(r, 5000));
      console.timeEnd("revalidate edge-unstable-cache");
      return "test";
    },
    ["test"],
    {
      revalidate: 10,
      tags: ["test"],
    }
  );
  const hi = await result();

  return <main className={styles.main}>{hi}</main>;
}
