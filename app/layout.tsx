import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dron Command Center',
  description: 'Real-time dashboard for all automated systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
