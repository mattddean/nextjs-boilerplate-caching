import { nextCache, nextCache2 } from "../../../lib/server-utils";

export const runtime = "edge";
export const fetchCache = "default-no-store";

export default async function Home() {
  const result = await nextCache({
    revalidate: 10,
    uniqueFnId: "testCache1",
  });

  return <main>{result}</main>;
}
