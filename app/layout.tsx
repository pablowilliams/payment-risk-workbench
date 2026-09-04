import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Payment Risk Workbench | Investigation operations",
  description: "A working demonstration of payment-risk investigation and model operations.",
  applicationName: "Payment Risk Workbench",
  authors: [{ name: "Pablo Williams" }],
  robots: { index: true, follow: true },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1915",
  colorScheme: "light",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
