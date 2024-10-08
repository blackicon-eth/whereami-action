import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "Where Am I?",
  description: "A composer action to share your location!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
