'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SCREENSHOTS } from '@/lib/constants';
export function ScreenshotLightbox({ index, onClose, onChange }: { index: number | null; onClose: () => void; onChange: (index: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [isOpen]); // Keep focus inside the dialog when changing slides.
  const screenshot = SCREENSHOTS[index ?? 0];
  return <dialog ref={dialog} className="lightbox" aria-label="NoicHub screenshot viewer" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key === 'Tab') {
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === 'ArrowRight') onChange(((index ?? 0) + 1) % SCREENSHOTS.length);
    if (event.key === 'ArrowLeft') onChange(((index ?? 0) + SCREENSHOTS.length - 1) % SCREENSHOTS.length);
  }}><div className="lightbox-content"><div className="lightbox-toolbar"><span>{screenshot.name} <span className="muted">/ NoicHub in action</span></span><button autoFocus className="icon-button" aria-label="Close screenshot" onClick={onClose}><X /></button></div>
    {index !== null && <Image src={screenshot.src} alt={`Actual NoicHub ${screenshot.name} interface in Roblox`} width={screenshot.width} height={screenshot.height} sizes="95vw" quality={90} className="lightbox-image" />}
    <div className="lightbox-bottom"><button className="icon-button" aria-label="Previous screenshot" onClick={() => onChange(((index ?? 0) + 2) % 3)}><ChevronLeft /></button><span>{(index ?? 0) + 1} / {SCREENSHOTS.length}</span><button className="icon-button" aria-label="Next screenshot" onClick={() => onChange(((index ?? 0) + 1) % 3)}><ChevronRight /></button></div>
  </div></dialog>;
}
