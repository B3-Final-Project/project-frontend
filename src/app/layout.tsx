import "./globals.css";

import { SidebarComponent } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { CognitoAuthProvider } from "@/providers/CognitoAuthProvider";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import type { Metadata } from "next";
import { ProfileGuard } from "@/components/guards/ProfileGuard";
import { MessagesClientWrapper } from "@/providers/MessagesClientWrapper";
import { GlobalMessageNotifications } from "@/providers/GlobalMessageNotifications";

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
            <MessagesClientWrapper>
              <GlobalMessageNotifications>
                <ProfileGuard>
                  <SidebarProvider>
                    <SidebarComponent />
                    <main className="w-full min-h-[calc(100vh-130px)]">
                      {children}
                    </main>
                    <div className="h-[130px] w-full"></div>
                    <Toaster />
                  </SidebarProvider>
                </ProfileGuard>
              </GlobalMessageNotifications>
            </MessagesClientWrapper>
          </CognitoAuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
