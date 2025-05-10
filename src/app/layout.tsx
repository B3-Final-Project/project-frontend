import type { Metadata } from "next";
import "./globals.css";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarComponent } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { CognitoAuthProvider } from "@/providers/CognitoAuthProvider";
import { Background } from "@/components/Background";


export const metadata: Metadata = {
  title: "Holomatch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <CognitoAuthProvider>
        <SidebarProvider>
          <html lang="en">
            <body>
              <Background/>
              <SidebarComponent/>
              <main className={'h-screen w-full'}>
                {children}
              </main>
              <Toaster/>
            </body>
          </html>
        </SidebarProvider>
      </CognitoAuthProvider>
    </ReactQueryClientProvider>
  );
}
