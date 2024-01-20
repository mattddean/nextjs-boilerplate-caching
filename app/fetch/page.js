export const dynamic = "force-dynamic";

export default async function Home() {
  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api/test`
    : "http://localhost:3000/api/test";
  const result = await fetch(url, { next: { revalidate: 10 } });
  const body = await result.json();

  return <main>{body.hi}</main>;
}
