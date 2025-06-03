import "./globals.css";

import { Background } from "@/components/Background";
import { CognitoAuthProvider } from "@/providers/CognitoAuthProvider";
import type { Metadata } from "next";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import { SidebarComponent } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

// Import debug utility for development
if (process.env.NODE_ENV === 'development') {
  import("@/lib/debug-auth");
}

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
            <SidebarProvider>
              <Background/>
              <SidebarComponent/>
              <main className={'h-screen w-full'}>
                {children}
              </main>
              <Toaster/>
            </SidebarProvider>
          </CognitoAuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
