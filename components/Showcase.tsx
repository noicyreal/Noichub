'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { SCREENSHOTS } from '@/lib/constants';
import { ScreenshotLightbox } from './ScreenshotLightbox';
import { Reveal } from './Motion';
export function Showcase() {
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const current = SCREENSHOTS[selected];
  return <section id="showcase" className="section showcase-section"><div className="container"><Reveal><div className="section-kicker"><span />A LOOK INSIDE</div><div className="section-heading"><h2>Familiar feel.<br /><span className="text-dim">A whole new experience.</span></h2><p>See the real thing, right in the game.<br />No mockups. Just NoicHub.</p></div></Reveal>
    <Reveal className="showcase-layout"><div className="showcase-side"><span className="mono-label">THE INTERFACE / 0{selected + 1}</span><h3>Made to feel<br />right at home.</h3><p>{current.description}</p><div className="showcase-tabs" role="tablist" aria-label="Choose an interface screenshot">{SCREENSHOTS.map((shot, index) => <button key={shot.src} id={`shot-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls="showcase-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => { let next = index; if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % 3; else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + 2) % 3; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = 2; else return; event.preventDefault(); setSelected(next); document.getElementById(`shot-tab-${next}`)?.focus(); }} className={selected === index ? 'selected' : ''}><span className="tab-number">0{index + 1}</span>{shot.name}<ArrowUpRight size={16} /></button>)}</div><span className="showcase-footnote"><span className="status-dot" />Actual in-game screenshots</span></div>
    <div id="showcase-panel" role="tabpanel" aria-labelledby={`shot-tab-${selected}`} className="showcase-panel"><div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>NoicHub — {current.name}</span><span className="mono-label">LIVE CAPTURE</span></div><button className="showcase-image-button" aria-label={`View ${current.name} screenshot full size`} onClick={() => setLightbox(selected)}><Image key={current.src} src={current.src} alt={`NoicHub ${current.name} GUI with controls displayed inside Roblox`} width={current.width} height={current.height} quality={90} sizes="(max-width: 767px) 95vw, 65vw" /><span className="expand-label"><Maximize2 size={15} />Expand screenshot</span></button><div className="showcase-caption"><span>{current.name} / Interface preview</span><span>0{selected + 1}<span className="text-dim"> / 03</span></span></div></div>
    </Reveal></div><ScreenshotLightbox index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} /></section>;
}
