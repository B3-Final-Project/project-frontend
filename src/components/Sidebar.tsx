import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Home } from 'lucide-react'
import { GiCardPick } from "react-icons/gi";
import { FiMessageSquare } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";



export function SidebarComponent() {
  const items = [
    { url: '/', icon: Home },
    { url: '/booster', icon: GiCardPick },
    { url: '/messages', icon: FiMessageSquare },
    { url: '/profile', icon: FaUser },
    { url: '/settings', icon: IoSettingsSharp},
  ]
  return (
    <>
      {/* Desktop Sidebar (visible on md and up) */}
      <div className="hidden md:block md:w-14">
        <Sidebar className={'max-w-fit'}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu className={'h-full flex justify-around my-10'}>
                {items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center space-x-2">
                        <item.icon />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Bottom Navigation (visible on smaller screens) */}
      <nav className="fixed inset-x-0 bottom-0 flex md:hidden bg-gray-50 border-t border-gray-200">
        <div className="flex justify-around w-full">
          {items.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="flex flex-col items-center justify-center p-3"
            >
              <item.icon size={20} />
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
