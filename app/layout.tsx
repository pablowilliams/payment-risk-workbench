import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "PulseLedger | Financial crime intelligence",
  description: "A synthetic real-time financial crime investigation and model operations platform.",
  applicationName: "PulseLedger",
  authors: [{ name: "Pablo Williams" }],
  robots: { index: true, follow: true },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1915",
  colorScheme: "dark light",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
