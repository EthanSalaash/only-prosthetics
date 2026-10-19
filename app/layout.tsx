import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "onlyPROsthetics",
  description: "Empowering mobility through advanced prosthetics and specialized rehabilitation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#12121A] text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}