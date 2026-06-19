import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloakroom — AI rails for fashion commerce",
  description:
    "Cloakroom is the unified AI infrastructure layer for fashion commerce: virtual try-on, creator storefronts, and brand ROI analytics on one rail.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2218%22 fill=%22%2315110E%22/><path d=%22M20 32h60M30 32v8c0 11 9 16 20 16s20-5 20-16v-8%22 stroke=%22%23C9A04D%22 stroke-width=%226%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ink text-cream antialiased">{children}</body>
    </html>
  );
}
