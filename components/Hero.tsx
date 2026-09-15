'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowDown, Code2, Maximize2, Sparkles } from 'lucide-react';
import { DiscordIcon } from './Brand';
import { DISCORD_URL, SCREENSHOTS, PLACE_IDS } from '@/lib/constants';
import { ScreenshotLightbox } from './ScreenshotLightbox';
import { Reveal } from './Motion';
export function Hero() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return <section id="home" className="hero"><div className="hero-grid" aria-hidden="true" /><div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
    <div className="container hero-content"><Reveal className="hero-copy"><div className="eyebrow-pill"><span className="status-dot" /> BUILT FOR YOUR NEXT SESSION <span className="pill-divider" /><ArrowUpRightMini /></div>
      <h1>One hub.<br />Your favorite<br /><span className="gradient-text">games.</span><span className="hero-period">_</span></h1>
      <p>A clean interface. A familiar experience.<br className="desktop-break" /> Meet NoicHub — your Lua hub for Roblox.</p>
      <div className="hero-actions"><a className="button button-primary" href="#script"><Code2 size={18} />Get Script<ArrowRight size={17} /></a><a className="button button-secondary" href={DISCORD_URL} target="_blank" rel="noopener noreferrer"><DiscordIcon />Join Discord</a></div>
      <div className="execution-milestone"><span className="milestone-icon"><Code2 size={18} /></span><div><strong>30,000+</strong><span>script executions</span></div><span className="milestone-note">AND COUNTING</span></div><div className="hero-notes"><span><span className="status-dot" />{PLACE_IDS.length} supported games</span><span className="note-divider" /><span>One simple loader</span></div>
    </Reveal>
    <Reveal className="hero-visual" delay={.16}><div className="preview-floating"><div className="preview-window"><div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>noichub / in-game preview</span><Code2 size={14} /></div><button className="hero-preview-button" onClick={() => setLightbox(0)} aria-label="Enlarge NoicHub preview"><Image src={SCREENSHOTS[0].src} alt="Actual NoicHub Defusal interface running inside Roblox" width={1299} height={731} priority quality={90} sizes="(max-width: 767px) 95vw, 58vw" /><span className="preview-enlarge"><Maximize2 size={14} />Take a closer look</span></button><div className="preview-status"><span><span className="status-dot" />NoicHub, in action.</span><span>LUA<span className="status-separator">/</span>ROBLOX</span></div></div>
      <div className="floating-tag"><span className="tag-icon"><Sparkles size={18} /></span><div>Less friction. More play.<small>One hub brings it together.</small></div><span className="tag-cross">+</span></div></div>
      <div className="visual-coordinate">01 — A BETTER WAY TO PLAY</div>
    </Reveal></div>
    <div className="container hero-bottom"><span>MADE FOR THE WAY YOU PLAY</span><a href="#features" aria-label="Explore NoicHub features">Scroll to explore <ArrowDown size={14} /></a><span className="hero-bottom-right">ROBLOX LUA HUB <span>✳</span></span></div>
    <ScreenshotLightbox index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
  </section>;
}
function ArrowUpRightMini() { return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M3 9 9 3M3 3h6v6" stroke="currentColor" /></svg>; }
