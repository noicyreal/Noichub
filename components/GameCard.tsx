'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Gamepad2, Users } from 'lucide-react';
import type { Game } from '@/lib/constants';
import type { PlayerCount } from '@/lib/player-counts';
import { GameStatusBadge } from './GameStatusBadge';
export function GameCard({ game, index, playerCount }: { game: Game; index: number; playerCount?: PlayerCount }) {
  const [failed, setFailed] = useState(false);
  return <a className="game-card" href={game.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${game.name ?? `Roblox experience ${game.placeId}`} on Roblox (new tab)`}><div className="game-image">{game.image && !failed ? <Image src={game.image} alt={game.name ?? 'Roblox experience thumbnail'} fill sizes="(max-width: 540px) 90vw, (max-width: 900px) 45vw, 25vw" onError={() => setFailed(true)} unoptimized /> : <div className="game-placeholder"><Gamepad2 size={35} /><span>Explore on Roblox</span></div>}<GameStatusBadge status={game.status ?? 'undetected'} /><span className="game-image-number">{String(index + 1).padStart(2, '0')}</span></div><div className="game-info"><div><span className="game-platform">ROBLOX EXPERIENCE</span><h3>{game.name ?? `Experience ${game.placeId}`}</h3><span className={`game-players ${playerCount?.live ? 'is-live' : 'is-saved'}`} title={playerCount?.updatedAt ? `Roblox player count updated ${playerCount.updatedAt}` : 'Player count unavailable'}><Users size={12} /><span>{playerCount ? `${playerCount.playing.toLocaleString('en-US')} ${playerCount.live ? 'playing now' : 'last known'}` : 'Players unavailable'}</span>{playerCount?.live && <span className="status-dot" />}</span></div><span className="game-link-icon"><ArrowUpRight size={18} /></span></div></a>;
}
