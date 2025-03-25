import type { Metadata } from "next";
import "./globals.css";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarComponent } from "@/components/Sidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";


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
      <AuthProvider>
        <SidebarProvider>
          <html lang="en">
            <body>
              <SidebarComponent/>
              <main className={'h-full w-full md:w-main'}>
                {children}
              </main>
              <Toaster/>
            </body>
          </html>
        </SidebarProvider>
      </AuthProvider>
    </ReactQueryClientProvider>
  );
}
