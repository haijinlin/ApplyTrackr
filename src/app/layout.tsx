import type { Metadata, Viewport } from "next";
import { Nav } from "@/components/nav";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApplyTrackr",
  description: "A fast, practical job application tracker.",
  applicationName: "ApplyTrackr",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ApplyTrackr",
  },
  icons: {
    icon: "/app-icon.svg",
    apple: "/app-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2f6b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistration />
        <Nav />
        <main className="main-shell">{children}</main>
      </body>
    </html>
  );
}
