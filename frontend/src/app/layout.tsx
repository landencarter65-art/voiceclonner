import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voice Studio | AI Voice Generation & Cloning",
  description:
    "Generate natural-sounding speech and clone voices with AI. Powered by Qwen3-TTS.",
  openGraph: {
    title: "Voice Studio | AI Voice Generation & Cloning",
    description:
      "Generate natural-sounding speech and clone voices with AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice Studio | AI Voice Generation & Cloning",
    description:
      "Generate natural-sounding speech and clone voices with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
