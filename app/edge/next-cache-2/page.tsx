import { nextCache2 } from "../../../lib/server-utils";

export const runtime = "edge";
export const fetchCache = "default-no-store";

async function testCache2() {
  console.time("revalidate edge-unstable-cache");
  await new Promise((r) => setTimeout(r, 5000));
  console.timeEnd("revalidate edge-unstable-cache");
  return "edge-unstable-cache";
}

export default async function Home() {
  const result = await nextCache2({
    fn: testCache2,
    revalidate: 10,
    uniqueFnId: "next-cache-2",
  });

  return <main>{result}</main>;
}
