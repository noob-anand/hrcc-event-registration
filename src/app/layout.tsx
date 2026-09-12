import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HRCC Event Registration 2026 | HackerRank Campus Crew IIIT Bhopal',
  description: 'Official Registration Portal for HackerRank Campus Crew (HRCC) Strategic Technical Chapter Launch 2026 at IIIT Bhopal. Featuring Vector 2.0 & AI/ML Workshop.',
  keywords: ['HackerRank', 'HRCC', 'IIIT Bhopal', 'Vector 2.0', 'AI ML Workshop', 'Coding Event', 'Event Registration'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="static-tech-bg">
          <div className="code-mesh"></div>
        </div>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
