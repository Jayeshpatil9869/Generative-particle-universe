import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Milan Companion — Generative Particle Universe',
  description: 'An interactive 3D WebGL particle universe featuring scroll-driven morphing formations, volumetric depth, and physical particle dynamics.',
  openGraph: {
    title: 'Milan Companion — Generative Particle Universe',
    description: 'An interactive 3D WebGL particle universe featuring scroll-driven morphing formations, volumetric depth, and physical particle dynamics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milan Companion — Generative Particle Universe',
    description: 'An interactive 3D WebGL particle universe featuring scroll-driven morphing formations, volumetric depth, and physical particle dynamics.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark bg-[#030303] text-white selection:bg-[#00F5A0]/20 selection:text-[#72FFD2]">
      <body suppressHydrationWarning className="bg-[#030303] text-white antialiased overflow-x-hidden selection:bg-[#00F5A0]/20 selection:text-[#72FFD2]">
        {children}
      </body>
    </html>
  );
}
