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
import { useContext, useEffect, useState } from "react";
import { HiveDto, UserDetailsDto } from "@/lib/Api";
import { FollowedHivesContext, HiveMimeApiContext, UserContext } from "@/lib/contexts";
import { CombGenerator } from "@/components/custom/utility/honey-comb";
import { mutedColors } from "@/lib/colors";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<UserDetailsDto | null>(null);
  const [followedHives, setFollowedHives] = useState<HiveDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const api = useContext(HiveMimeApiContext);

  async function loginAsync(){
    setIsLoading(true);

    const loginResponse = await api.api.userLoginList({ username: "TestUser" });
    api.setSecurityData(loginResponse.data.token);
    console.log("Logged in with token:", loginResponse.data.token);

    const userDetailsResponse = await api.api.userDetailsList();
    const followedHivesResponse = await api.api.hiveFollowedList();

    setUser(userDetailsResponse.data);
    setFollowedHives(followedHivesResponse.data);

    setIsLoading(false);
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
        <UserContext.Provider value={{ user, setUser }}>
          <FollowedHivesContext.Provider value={{ followedHives, setFollowedHives }}>
            <SidebarProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <div className="[--header-height:calc(--spacing(14))] w-full min-h-screen">
                  <SidebarProvider className="flex flex-col">
                    <div className="flex flex-1">
                      <AppSidebar />
                      <SidebarInset>
                        <CombGenerator distances={[8, 4, 2]}
                          color={mutedColors.honeyBrown} />

                        <SiteHeader />
                        {isLoading ?
                          (<div>Loading...</div>) :
                          (<div className="flex flex-1 flex-col gap-4 py-4 z-0 min-h-10000">
                            {children}
                          </div>)
                        }
                        <Toaster position="top-center" richColors />
                      </SidebarInset>
                    </div>

                  </SidebarProvider>
                </div>
              </ThemeProvider>
            </SidebarProvider>
          </FollowedHivesContext.Provider>
        </UserContext.Provider>
      </body>
    </html>
  );
}
