import type { Metadata } from "next";
import "./globals.css";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarComponent } from "@/components/Sidebar";


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
      <SidebarProvider>
        <html lang="en">
          <body>
            <SidebarComponent/>
            {children}
          </body>
        </html>
      </SidebarProvider>
    </ReactQueryClientProvider>
  );
}
