import { getNewArrivals } from "@/lib/data";
import HomePageClient from "@/components/home/HomePageClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const newArrivals = await getNewArrivals();

  return <HomePageClient newArrivals={newArrivals} />;
}
