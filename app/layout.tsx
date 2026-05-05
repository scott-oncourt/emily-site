import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emily — Cambodia",
  description:
    "Ancient grace. Modern world. Pure Cambodia. Follow Emily — Khmer fashion, travel, and culture through the eyes of someone who lives it.",
  openGraph: {
    title: "Emily — Cambodia",
    description: "Ancient grace. Modern world. Pure Cambodia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
