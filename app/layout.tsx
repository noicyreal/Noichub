import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
const bodyFont = localFont({ src: [{ path: '../public/fonts/dm-sans-regular.ttf', weight: '400', style: 'normal' }, { path: '../public/fonts/dm-sans-semibold.ttf', weight: '600', style: 'normal' }], variable: '--font-dm', display: 'swap' });
const headingFont = localFont({ src: [{ path: '../public/fonts/space-grotesk-medium.ttf', weight: '500', style: 'normal' }, { path: '../public/fonts/space-grotesk-bold.ttf', weight: '700', style: 'normal' }], variable: '--font-space', display: 'swap' });
import { MotionProvider } from '@/components/Motion';
import './globals.css';
import { assetPath } from '@/lib/constants';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'NoicHub — Roblox Lua Hub',
  description: 'NoicHub is a modern Lua hub supporting a growing selection of Roblox experiences.',
  openGraph: { title: 'NoicHub — Roblox Lua Hub', description: 'One hub. Your favorite games. A modern Lua hub for Roblox.', type: 'website', images: [{ url: assetPath('/images/showcase/noichub-1.webp'), width: 1299, height: 731, alt: 'NoicHub interface running in Roblox' }] },
  twitter: { card: 'summary_large_image', title: 'NoicHub — Roblox Lua Hub', images: [assetPath('/images/showcase/noichub-1.webp')] },
};
export const viewport: Viewport = { themeColor: '#0a0a0e' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}><body><MotionProvider><a className="skip-link" href="#main">Skip to content</a>{children}</MotionProvider></body></html>; }
