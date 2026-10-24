import type { Metadata } from 'next';
import './globals.css';
import './immersive-office.css';
import './reference-office.css';
import './dark-inspector.css';
import '../features/characters/interactions.css';
import './glass-theme.css';
import '../features/environment/environment.css';
export const metadata:Metadata={title:'BSD Office — 함께 만드는 좋은 일',description:'Claude Code와 Codex가 함께 일하는 나만의 에이전시 사무실'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ko"><head><link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}</body></html>}
