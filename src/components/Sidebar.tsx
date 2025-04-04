import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Home } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { FaRegUser } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";



export function SidebarComponent() {
  const items = [
    { title: "Home", url: '/', icon: Home},
    { title: "Messages", url: '/messages', icon: FiMessageSquare},
    { title: "Open a Booster", url: '/booster'},
    { title: "Profile", url:'/profile', icon: FaRegUser},
    { title: "Settings", url: '/settings', icon: IoSettingsOutline},
  ]
  return (
    <>
      {/* Desktop Sidebar (visible on md and up) */}
      <div className="hidden md:block md:w-16 lg:w-48">
        <Sidebar className={'max-w-fit'}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu className={'h-full flex justify-center gap-6'}>
                {items.map((item) => {
                  const IconComponent = item.icon as React.ElementType;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className="flex items-center space-x-2">
                          {item.icon ? (
                            <IconComponent style={{width: '1.5rem', height: '1.5rem'}} size={40} />
                          ) : (
                            <Image
                              src="/logo.svg"
                              width={25}
                              height={25}
                              alt="logo"
                              className="w-6 h-6"
                            />
                          )}
                          <span className="hidden lg:block">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Bottom Navigation (visible on smaller screens) */}
      <nav className="fixed inset-x-0 bottom-0 flex md:hidden bg-gray-50 border-t border-gray-200 z-50">
        <div className="flex justify-around w-full">
          {items.map((item) => {
            const IconComponent = item.icon as React.ElementType<{ size: number }>;
            return <Link
              key={item.url}
              href={item.url}
              className="flex flex-col items-center justify-center p-3"
            >
              {item.icon ? <IconComponent size={20} /> : <Image src="/logo.svg" width={20} height={20} alt="logo" />}
            </Link>})
          }
        </div>
      </nav>
    </>
  )
}
