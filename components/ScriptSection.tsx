'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Terminal, ArrowDownRight } from 'lucide-react';
import { LOADER } from '@/lib/constants';
import { Reveal } from './Motion';
export function ScriptSection() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const code = useRef<HTMLElement>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try { await navigator.clipboard.writeText(LOADER); setStatus('copied'); }
    catch {
      const selection = window.getSelection();
      if (code.current && selection) { const range = document.createRange(); range.selectNodeContents(code.current); selection.removeAllRanges(); selection.addRange(range); code.current.focus(); }
      setStatus('error');
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 3500);
  }
  return <section id="script" className="section script-section"><div className="container"><Reveal className="script-layout"><div className="script-intro"><div className="section-kicker"><span />ONE LINE. YOU’RE IN.</div><h2>Load <span className="gradient-text">NoicHub.</span></h2><p>Your next session starts here.<br />Copy the loader and you’re ready to go.</p><div className="script-decoration" aria-hidden="true"><span>{'{ }'}</span><ArrowDownRight size={38} strokeWidth={1} /></div></div><div className="code-area"><div className="code-editor"><div className="code-editor-bar"><span><Terminal size={15} />loader.luau</span><span className="lua-badge"><span />LUA</span></div><div className="code-line"><span className="line-number" aria-hidden="true">01</span><pre tabIndex={0} aria-label="NoicHub Lua loader"><code ref={code}><span className="syntax-function">loadstring</span><span>(game:</span><span className="syntax-method">HttpGet</span><span>(</span><span className="syntax-string">&quot;https://raw.githubusercontent.com/noicyreal/Noichub/refs/heads/main/loader.luau&quot;</span><span>))()</span></code></pre></div><div className="code-editor-bottom"><span><span className="status-dot" />One loader for every supported game</span><button className={`button copy-button ${status === 'copied' ? 'copied' : ''}`} onClick={copy}><AnimatePresence mode="wait" initial={false}><motion.span key={status} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{status === 'copied' ? <Check size={15} /> : <Copy size={15} />}{status === 'copied' ? 'Copied!' : 'Copy script'}</motion.span></AnimatePresence></button></div></div><p className="code-note" aria-live="polite">{status === 'error' ? 'Clipboard unavailable. The code is selected — press Ctrl+C or ⌘C to copy.' : status === 'copied' ? 'Copied to clipboard. You’re ready for your next session.' : 'Copy. Load. Play. It’s that simple.'}</p></div></Reveal></div></section>;
}
