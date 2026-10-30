import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'BB20 Insider | Bigg Boss Hindi Season 20',description:'Live Bigg Boss 20 Hindi headlines, evictions, nominations and episodes. Independent fan dashboard.',applicationName:'BB20 Insider'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
