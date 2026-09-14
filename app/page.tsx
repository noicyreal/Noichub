import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Showcase } from '@/components/Showcase';
import { GameGrid } from '@/components/GameGrid';
import { ScriptSection } from '@/components/ScriptSection';
import { DiscordCTA } from '@/components/DiscordCTA';
import { Footer } from '@/components/Footer';
import { getGames } from '@/lib/roblox';
export default async function Home() {
  const games = await getGames();
  return <><Navbar/><main id="main"><Hero/><Features/><Showcase/><GameGrid games={games}/><ScriptSection/><DiscordCTA/></main><Footer/></>;
}
