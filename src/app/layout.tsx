import type { Metadata, Viewport } from "next";
import App from "../components/App";
import { getArticlesList } from "../utilities/articles.server";
import config from "../config";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LayoutWrapper from "../components/LayoutWrapper/LayoutWrapper";
import LayoutContentWrapper from "../components/LayoutContentWrapper/LayoutContentWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(config.meta.url),
  title: {
    template: `%s - ${config.meta.title}`,
    default: config.meta.title,
  },
  description: config.meta.description,
  robots: {
    follow: true,
  },
  openGraph: {
    title: {
      template: `%s - ${config.meta.title}`,
      default: config.meta.title,
    },
    description: config.meta.description,
    type: "website",
    url: "/",
    siteName: config.meta.description,
  },
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    site: config.meta.twitter?.username && `@${config.meta.twitter.username}`,
    creator:
      config.meta.twitter?.username && `@${config.meta.twitter.username}`,
  },
};

export const viewport: Viewport = {
  themeColor: "black",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const availableRoutes = getArticlesList();

  return (
    <html lang="en" data-rs-theme="blog" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
							const matcher = window.matchMedia("(prefers-color-scheme: dark)"); 
							const systemColorMode = matcher.matches ? "dark" : "light";
							const storedColorMode = localStorage.getItem("__rs-color-mode"); 

							document.documentElement.setAttribute("data-rs-color-mode", storedColorMode || systemColorMode);
							matcher.addEventListener("change", () => { 
							 	document.body.setAttribute("data-rs-color-mode", systemColorMode);
							});
					`,
          }}
        />
      </head>
      <body>
        <LayoutWrapper availableRoutes={availableRoutes}>
          <App>
            <LayoutContentWrapper availableRoutes={availableRoutes}>
              {children}
              <Analytics />
              <SpeedInsights />
            </LayoutContentWrapper>
          </App>
        </LayoutWrapper>
      </body>
    </html>
  );
}
