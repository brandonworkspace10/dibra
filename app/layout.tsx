import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  description:
    "Turn difficult source text into clear, natural high-school explanations.",
  metadataBase: new URL("https://www.dbtext.dev"),
  robots: {
    follow: false,
    index: false,
    nocache: true,
  },
  title: "ClearDraft — Study writing, made clear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${fredoka.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
