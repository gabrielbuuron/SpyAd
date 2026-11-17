import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata:Metadata={
  title:'SpyAd | Inteligência criativa',
  applicationName:'SpyAd',
  description:'Inteligência publicitária demonstrativa e Creative Lab local para imagens próprias ou autorizadas.',
  manifest:'/manifest.webmanifest',
  icons:{
    icon:[
      {url:'/brand/favicon.svg',type:'image/svg+xml',sizes:'any'},
      {url:'/brand/favicon-32.png',type:'image/png',sizes:'32x32'},
      {url:'/brand/favicon-16.png',type:'image/png',sizes:'16x16'},
    ],
    shortcut:'/brand/favicon.ico',
    apple:[{url:'/brand/apple-touch-icon-180.png',type:'image/png',sizes:'180x180'}],
  },
};
export const viewport:Viewport={themeColor:'#0b0e14'};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="pt-BR"><body>{children}</body></html>;
}
