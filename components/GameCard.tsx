'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Gamepad2 } from 'lucide-react';
import type { Game } from '@/lib/constants';
export function GameCard({ game, index }: { game: Game; index: number }) {
  const [failed, setFailed] = useState(false);
  return <a className="game-card" href={game.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${game.name ?? `Roblox experience ${game.placeId}`} on Roblox (new tab)`}><div className="game-image">{game.image && !failed ? <Image src={game.image} alt={game.name ?? 'Roblox experience thumbnail'} fill sizes="(max-width: 540px) 90vw, (max-width: 900px) 45vw, 25vw" onError={() => setFailed(true)} unoptimized /> : <div className="game-placeholder"><Gamepad2 size={35} /><span>Explore on Roblox</span></div>}<span className="supported-badge"><span className="status-dot" />Supported</span><span className="game-image-number">{String(index + 1).padStart(2, '0')}</span></div><div className="game-info"><div><span className="game-platform">ROBLOX EXPERIENCE</span><h3>{game.name ?? `Experience ${game.placeId}`}</h3></div><span className="game-link-icon"><ArrowUpRight size={18} /></span></div></a>;
}
