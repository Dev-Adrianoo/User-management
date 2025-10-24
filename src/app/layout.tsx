import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Authprovider } from "@/providers/auth-provider"
import { ToastProvider } from "@/providers/toast-provider"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "User Management App",
  description: "Plataforma criada para gerenciar usuários com Next.js, Prisma e Docker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Authprovider>
          {children}
          <ToastProvider /> {/* Render ToastProvider here */}
        </Authprovider>
      </body>
    </html>
  );
}
