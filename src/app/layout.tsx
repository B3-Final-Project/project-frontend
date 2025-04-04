import { SidebarComponent } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import type { Metadata } from "next";
import "./globals.css";

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
          <SidebarProvider>
            <SidebarComponent />
            {children}
          </SidebarProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
