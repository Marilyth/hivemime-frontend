"use client";

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
import { Suspense, useEffect, useState } from "react";
import { HiveDto } from "@/lib/Api";
import { AccentColourContext, FollowedHivesContext, userStore } from "@/lib/contexts";
import { CombGenerator } from "@/components/custom/utility/honey-comb";
import { mutedColors } from "@/lib/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

const RootLayout = observer(({ children }: { children: React.ReactNode }) => {
  const [followedHives, setFollowedHives] = useState<HiveDto[]>([]);
  const [accentColour, setAccentColour] = useState<string | null>(null);

  useEffect(() => {
    setAccentColour(localStorage.getItem("accentColour"));
  }, []);

  useEffect(() => {
    if (accentColour) {
      localStorage.setItem("accentColour", accentColour);
    } else {
      localStorage.removeItem("accentColour");
    }
  }, [accentColour]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/HiveMimeIcon.png" />
        <title>HiveMime</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <FollowedHivesContext.Provider value={{ followedHives, setFollowedHives }}>
            <AccentColourContext.Provider value={{ accentColour, setAccentColour }}>
              <SidebarProvider>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                  <div className="[--header-height:calc(--spacing(14))] w-full min-h-screen">
                  <SidebarProvider className="flex flex-col">
                    <div className="flex flex-1">
                      <AppSidebar className="backdrop-blur-sm" />
                      <SidebarInset>
                        <CombGenerator distances={[8, 4, 2]}
                          color={accentColour ?? mutedColors.honeyBrown} />

                        <Suspense>
                          <SiteHeader />
                        </Suspense>

                        <div className="flex justify-center">
                          <div className="w-full max-w-183 gap-4">
                            {!userStore.user ?
                              (<div>Loading...</div>) :
                              (<div className="flex flex-1 flex-col gap-4 py-4 z-0 px-2">
                                {children}
                              </div>)
                            }
                          </div>
                        </div>
                        <Toaster position="bottom-right" />
                      </SidebarInset>
                    </div>

                  </SidebarProvider>
                </div>
              </ThemeProvider>
            </SidebarProvider>
          </AccentColourContext.Provider>
        </FollowedHivesContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
});

export default RootLayout;