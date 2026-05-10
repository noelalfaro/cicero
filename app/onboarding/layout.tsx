import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import '../globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ViewTransitions } from 'next-view-transitions';
import { Roboto } from 'next/font/google';
const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Prospect Portfolio',
  description:
    'Prospect Portfolio is a web app for users to invest in their favorite NBA players potential. This works through a web interface that users can log into, browse/search different players and “Invest” into their current score. This ***score*** is defined through both the players performance through stats in game as well as the sentiment analysis of the players online reputation such as what people and analysts are posting about them online',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/login');
  if (session.user.onboarding_status) redirect('/dashboard');

  return (
    <ViewTransitions>
      <html lang="en" className={` ${inter.variable} ${roboto.variable}`}>
        <body className={`${inter.className}`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="container flex h-[100svh] w-full max-w-7xl flex-col items-center justify-center px-[1rem] lg:px-[2rem]">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
