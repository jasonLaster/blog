import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { Footer } from "@/app/components/Footer";
import { themeEffect } from "@/app/theme-effect";
import { ThemeToggle } from "@/app/theme-toggle";
import CommandMenu from "./components/command-menu";
import { getBlogPosts } from "./utils/post";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://jasonlaster.com"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Jason Laster",
    template: "%s | Jason Laster",
  },
  description: "Jason Laster",
  openGraph: {
    title: "Jason Laster",
    description: "Jason Laster",
    siteName: "Jason Laster",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


async function Header() {
  const posts = (await getBlogPosts()).map((post) => ({
    metadata: post.metadata,
    slug: post.slug,
  }));

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex  justify-between gap-4">
        <Link
          className="font-bold text-zinc-900 dark:text-zinc-200 text-lg"
          href="/"
        >
          Jason Laster
        </Link>
        <div className="flex gap-4 align-middle items-center text-sm text-zinc-500">
          <ThemeToggle />
          <Link
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
            href="/posts"
          >
            Posts
          </Link>
          <Link
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
            href="/posts?notes=true"
          >
            Notes
          </Link>
        </div>
      </div>
      <CommandMenu posts={posts} />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-rs-theme="blog"
      className={`${inter.className}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();`,
          }}
        />
      </head>

      <body className="antialiased tracking-tight">
        <div className="min-h-screen flex flex-col justify-between pt-0 md:pt-8 p-8  text-gray-900 dark:text-zinc-200">
          <main className="max-w-[65ch] mx-auto w-full space-y-6">
            <Header />
            <div>{children}</div>

            <Analytics />
            <SpeedInsights />
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
