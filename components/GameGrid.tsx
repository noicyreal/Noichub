'use client';
import { useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import type { Game } from '@/lib/constants';
import { DISCORD_URL } from '@/lib/constants';
import { GameCard } from './GameCard';
import { Reveal } from './Motion';
export function GameGrid({ games }: { games: Game[] }) {
  const [query, setQuery] = useState('');
  const filtered = games.filter(g => `${g.name ?? ''} ${g.placeId}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <section id="games" className="section games-section"><div className="container"><Reveal><div className="section-kicker"><span />FIND YOUR NEXT SESSION</div><div className="section-heading"><div><h2>Your games. <span className="text-dim">Our hub.</span></h2><p className="heading-subtitle">A growing lineup. The same NoicHub experience.</p></div><span className="count-pill"><span className="status-dot" />{games.length} supported experiences</span></div><div className="games-toolbar"><span>ALL GAMES <span className="game-count">{games.length}</span></span><div className="search-box"><Search size={16} /><input type="search" aria-label="Search supported games" placeholder="Find your game…" value={query} onChange={e => setQuery(e.target.value)} />{query && <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear game search"><X size={14} /></button>}</div></div></Reveal>
    <div className="games-grid">{filtered.map((game, index) => <Reveal key={game.placeId} delay={Math.min(index % 4, 3) * .055}><GameCard game={game} index={games.indexOf(game)} /></Reveal>)}</div>
    {filtered.length === 0 && <div className="empty-state" role="status"><Search size={28} /><h3>No games found</h3><p>Try a different name or place ID.</p><button className="button button-secondary" onClick={() => setQuery('')}>Show all games</button></div>}
    <div className="games-footer"><p>Your next favorite could be next on the list.</p><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Suggest a game on Discord<ArrowUpRight size={15} /></a></div>
  </div></section>;
}
