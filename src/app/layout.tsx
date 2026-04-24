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
import { Suspense, useContext, useEffect, useState } from "react";
import { HiveDto, UserDetailsDto } from "@/lib/Api";
import { AccentColourContext, FollowedHivesContext, HiveMimeApiContext, UserContext } from "@/lib/contexts";
import { CombGenerator } from "@/components/custom/utility/honey-comb";
import { mutedColors } from "@/lib/colors";
import { useIsMobile } from "@/hooks/use-mobile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<UserDetailsDto | null>(null);
  const [followedHives, setFollowedHives] = useState<HiveDto[]>([]);
  const [accentColour, setAccentColour] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const api = useContext(HiveMimeApiContext);

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
          <UserContext.Provider value={{ user, setUser }}>
            <FollowedHivesContext.Provider value={{ followedHives, setFollowedHives }}>
              <AccentColourContext.Provider value={{ accentColour, setAccentColour }}>
                <SidebarProvider>
                  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <div className="[--header-height:calc(--spacing(14))] w-full min-h-screen">
                      <SidebarProvider className="flex flex-col">
                        <div className="flex flex-1">
                          <AppSidebar className="backdrop-blur-sm" />
                          <SidebarInset className="min-h-10000">
                            <CombGenerator distances={[8, 4, 2]}
                              color={accentColour ?? mutedColors.honeyBrown} />

                            <Suspense>
                              <SiteHeader />
                            </Suspense>

                            {!user ?
                              (<div>Loading...</div>) :
                              (<div className="flex flex-1 flex-col gap-4 py-4 z-0 px-2">
                                {children}
                              </div>)
                            }
                            <Toaster position="bottom-right" />
                          </SidebarInset>
                        </div>

                      </SidebarProvider>
                    </div>
                  </ThemeProvider>
                </SidebarProvider>
              </AccentColourContext.Provider>
            </FollowedHivesContext.Provider>
          </UserContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
