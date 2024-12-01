import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Nav from '@/components/nav';
import { ViewTransitions } from 'next-view-transitions';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cicero - Development',
  description:
    'Cicero is a web app for users to invest in their favorite NBA players potential. This works through a web interface that users can log into, browse/search different players and “Invest” into their current score. This ***score*** is defined through both the players performance through stats in game as well as the sentiment analysis of the players online reputation such as what people and analysts are posting about them online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={` ${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="container flex min-h-screen w-full max-w-7xl flex-col px-[1rem] lg:px-[2rem]">
              <Nav />
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
