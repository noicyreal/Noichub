import { getGames } from '@/lib/roblox';
export const dynamic = 'force-static';
export async function GET() {
  return Response.json({ games: await getGames() }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } });
}
