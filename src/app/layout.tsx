import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/app/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Junior Stats — ახალგაზრდული ფეხბურთის სტატისტიკა",
  description: "ტურნირები, გუნდები, მოთამაშეები — ახალგაზრდული ფეხბურთის სრული სტატისტიკა",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" className={inter.variable}>
      <body suppressHydrationWarning className={`${inter.className} antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
