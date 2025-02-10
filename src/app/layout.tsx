import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jobly",
  description: "AI-powered job matching platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} min-h-full w-full`}>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}