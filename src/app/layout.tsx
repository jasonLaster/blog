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
    <html lang="en" data-rs-theme="blog" data-rs-color-mode="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global feature flag for theme toggle functionality
              window.__ENABLE_THEME_TOGGLE__ = false;
              
              (function() {
                try {
                  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.documentElement.dataset.rsColorMode = "dark";
                  } else {
                    document.documentElement.dataset.rsColorMode = "light";
                  }
                  
                  // Only remove stored preference if theme toggle is disabled
                  if (!window.__ENABLE_THEME_TOGGLE__) {
                    localStorage.removeItem("__rs-color-mode");
                  } else if (localStorage.getItem("__rs-color-mode")) {
                    // If theme toggle is enabled and user has a preference, use it
                    document.documentElement.dataset.rsColorMode = localStorage.getItem("__rs-color-mode");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <App initialColorMode="light">
          <LayoutWrapper availableRoutes={availableRoutes}>
            <LayoutContentWrapper availableRoutes={availableRoutes}>
              {children}
              <Analytics />
              <SpeedInsights />
            </LayoutContentWrapper>
          </LayoutWrapper>
        </App>
      </body>
    </html>
  );
}
