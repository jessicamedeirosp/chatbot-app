import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../hooks/useAppContext';

export const metadata: Metadata = {
  title: 'Chat Online',
  description: 'Chat Online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
