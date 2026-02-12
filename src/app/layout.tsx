import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "色脉 SeMai — 溯源千年色彩 · 探寻东方美学",
  description:
    "Tracing traditional Chinese colors through millennia. 溯源千年色彩，探寻东方美学。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
