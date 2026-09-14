'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Brand, DiscordIcon } from './Brand';
import { DISCORD_URL } from '@/lib/constants';
const links = ['Home', 'Features', 'Showcase', 'Games', 'Script'];
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && document.getElementById('menu-toggle')?.getAttribute('aria-expanded') === 'true') { setOpen(false); document.getElementById('menu-toggle')?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => { observer.disconnect(); document.removeEventListener('keydown', onKey); };
  }, []);
  return <header className="site-header"><nav className="container nav" aria-label="Main navigation">
    <a href="#home" className="logo-link" aria-label="NoicHub home" onClick={() => setOpen(false)}><Brand /></a>
    <div className="desktop-links">{links.map(label => <a key={label} className={active === label.toLowerCase() ? 'active' : ''} href={`#${label.toLowerCase()}`} aria-current={active === label.toLowerCase() ? 'location' : undefined}>{label}</a>)}</div>
    <a className="button nav-discord" href={DISCORD_URL} target="_blank" rel="noopener noreferrer"><DiscordIcon /> <span>Join Discord</span><ArrowUpRight size={15} /></a>
    <button id="menu-toggle" className="icon-button menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button>
    <AnimatePresence>{open && <motion.div id="mobile-menu" className="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><div>{links.map(label => <a href={`#${label.toLowerCase()}`} key={label} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}<a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Join Discord<DiscordIcon /></a></div></motion.div>}</AnimatePresence>
  </nav></header>;
}
