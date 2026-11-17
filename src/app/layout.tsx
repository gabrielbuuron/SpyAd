import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SpyAd | Intelligence", description: "Plataforma de inteligência publicitária — protótipo demonstrativo." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html>; }
