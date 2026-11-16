import type { Metadata } from "next";

// Served at https://cal.jlast.io via a host rewrite in next.config.ts.
// The booking page is embedded (not redirected) so the URL stays cal.jlast.io.
const CAL_URL =
  "https://cal.com/jason-laster-zo91q9/calls?layout=mobile&overlayCalendar=true";

export const metadata: Metadata = {
  title: { absolute: "Chat with Jason Laster" },
  description: "Book a call with Jason Laster",
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return (
    <iframe
      src={CAL_URL}
      title="Book a call with Jason Laster"
      className="fixed inset-0 z-50 h-dvh w-screen border-0 bg-white"
      allow="payment; clipboard-write"
    />
  );
}
