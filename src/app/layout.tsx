import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { FaXTwitter, FaGithub } from 'react-icons/fa6';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

function Header() {
  return (            
  <div className="flex flex-col gap-4 mb-8">
    <div className="flex  justify-between gap-4">
      <Link className="font-bold"  href="/" >Jason Laster</Link>
      <div className="flex gap-4 align-middle items-center text-sm text-neutral-500">
        <Link className="hover:text-neutral-700 dark:hover:text-neutral-300" href="/about" >About</Link>
        <Link className="hover:text-neutral-700 dark:hover:text-neutral-300" href="https://x.com/jasonlaster11" aria-label="Twitter" ><FaXTwitter /></Link>
        <Link className="hover:text-neutral-700 dark:hover:text-neutral-300" href="https://github.com/jasonlaster" aria-label="GitHub" ><FaGithub /></Link>
      </div>
    </div>
  </div>
)
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-rs-theme="blog" data-rs-color-mode="light" className={`${inter.className}`}>
      <body className="antialiased tracking-tight">
        <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8 dark:bg-zinc-950 bg-white text-gray-900 dark:text-zinc-200">
          <main className="max-w-[65ch] mx-auto w-full space-y-6">
            <Header />
            <div>{children}</div>

            <Analytics />
            <SpeedInsights />
          </main>
        </div>
      </body>
    </html>
  );
}