"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { createContext, useEffect } from "react";
import { Api } from "@/lib/Api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const HiveMimeApiContext = createContext<Api<unknown> | null>(null);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const api = new Api({
    baseUrl: "https://api.mayiscoding.com",
    securityWorker: (securityData) =>
      securityData ? { headers: { Authorization: `Bearer ${securityData}` } } : undefined,
  });

  async function loginAsync(){
    const response = (await api.api.authLoginList()).data;
    api.setSecurityData(response.token);
  }

  useEffect(() => {
    loginAsync();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/HiveMimeIcon.png" />
        <title>HiveMime</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HiveMimeApiContext.Provider value={api}>
          <SidebarProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <div className="[--header-height:calc(--spacing(14))] w-full min-h-screen">
                <SidebarProvider className="flex flex-col">

                  <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset>
                      <SiteHeader />
                      <div className="flex flex-1 flex-col gap-4 py-4 bg-pattern">
                        {children}
                      </div>
                      <Toaster position="top-center" richColors />
                    </SidebarInset>
                  </div>

                </SidebarProvider>
              </div>
            </ThemeProvider>
          </SidebarProvider>
        </HiveMimeApiContext.Provider>
      </body>
    </html>
  );
}
