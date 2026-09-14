import { PanelsTopLeft, Gamepad2, Zap, MessagesSquare, ArrowUpRight } from 'lucide-react';
import { Reveal } from './Motion';
const features = [
  { icon: PanelsTopLeft, title: 'Clean by design', text: 'A modern interface that keeps everything simple and easy to navigate.', detail: 'MODERN INTERFACE' },
  { icon: Gamepad2, title: 'One hub. More games.', text: 'Jump between a growing collection of your favorite Roblox experiences.', detail: 'MULTIPLE GAMES' },
  { icon: Zap, title: 'Ready in a few clicks', text: 'Copy one loader. Get straight to the experience. Keep things moving.', detail: 'QUICK LOADING' },
  { icon: MessagesSquare, title: 'Better, together', text: 'Find updates, share feedback, and connect with the NoicHub community.', detail: 'COMMUNITY FIRST' },
];
export function Features() { return <section id="features" className="section features-section"><div className="container"><Reveal><div className="section-kicker"><span />THE NOICHUB DIFFERENCE</div><div className="section-heading"><h2>Everything you need.<br /><span className="text-dim">Nothing in your way.</span></h2><p>Thoughtfully built. Effortlessly familiar.<br />A little less setup, a lot more playing.</p></div></Reveal><div className="feature-grid">{features.map(({ icon: Icon, title, text, detail }, index) => <Reveal key={title} delay={index * .07}><article className="feature-card"><div className="feature-card-top"><span className="feature-icon"><Icon size={21} strokeWidth={1.5} /></span><span className="feature-number">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p><div className="feature-detail">{detail}<ArrowUpRight size={14} /></div></article></Reveal>)}</div></div></section>; }
