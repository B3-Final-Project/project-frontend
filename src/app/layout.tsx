import "./globals.css";

import { SidebarComponent } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { CognitoAuthProvider } from "@/providers/CognitoAuthProvider";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import type { Metadata } from "next";
import { ProfileGuard } from "@/components/guards/ProfileGuard";

export const metadata: Metadata = {
  title: "Holomatch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryClientProvider>
          <CognitoAuthProvider>
            <ProfileGuard>
              <SidebarProvider>
                <SidebarComponent />
                <main className={"h-[calc(100vh-130px)] w-full"}>
                  {children}
                  <div className="h-[130px] w-full"></div>
                </main>
                <Toaster />
              </SidebarProvider>
            </ProfileGuard>
          </CognitoAuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
