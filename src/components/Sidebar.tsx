'use client'

import { FiMessageSquare, FiShield } from "react-icons/fi";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa";
import { Home } from 'lucide-react';
import Image from "next/image";
import { IoSettingsOutline } from "react-icons/io5";
import Link from 'next/link';
import {Quantico} from "next/font/google";
import { SignInButton } from "@/components/auth/SignInButton";
import { clsx } from "clsx";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";

const quantico = Quantico({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export function SidebarComponent() {
  const auth = useAuth()
  const router = useRouter()
  const items = [
    { title: "Home", url: '/', icon: Home },
    { title: "Messages", url: '/messages', icon: FiMessageSquare },
    { canUse: true, title: "Open a Booster", url: '/boosters' },
    { title: "Profile", url: '/profile', icon: FaRegUser },
    { title: "Settings", url: '/register', icon: IoSettingsOutline },
  ]
  const groups = auth.user?.profile['cognito:groups'] as string[]
  const isAdmin = groups?.includes('admin') ?? false;

  const signOutAction = async () => {
    await auth.removeUser()
    router.replace('/')
  }

  return (
    <>
      {/* Desktop Sidebar (visible on md and up) */}
      <div className="hidden md:block md:w-16 lg:w-48">
        <Sidebar className={'md:w-16 lg:w-48'}>
          <SidebarContent>
            <SidebarGroup>
              <div className={'relative mx-auto h-[43px] lg:h-[156px] w-full flex items-center '}>
                <Image src="/logo.png" fill={true} alt="logo" />
              </div>
              <h2 className={clsx('hidden text-xl mx-auto lg:block', quantico.className)}>HOLOMATCH</h2>
              <SidebarMenu className={'h-full flex justify-center gap-6'}>
                {items.map((item) => {
                  const IconComponent = item.icon as React.ElementType;
                  return (
                    <SidebarMenuItem key={item.url}>
                      {auth.user &&
                        <SidebarMenuButton asChild>
                          <Link href={item.url} className="flex items-center space-x-2">
                            {item.icon ? (
                              <IconComponent style={{ width: '1.5rem', height: '1.5rem' }} size={40} />
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
                      }
                    </SidebarMenuItem>
                  );
                })}
                {isAdmin && <SidebarMenuButton asChild>
                  <Link href={'/admin'}>
                    <FiShield style={{ width: '1.5rem', height: '1.5rem' }} size={40} />
                    <span className="hidden lg:block">Admin Dashboard</span>
                  </Link>
                </SidebarMenuButton>}
              </SidebarMenu>
              {auth.user && <Button onClick={() => signOutAction()}>Logout</Button>}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Bottom Navigation (visible on smaller screens) */}
      <nav className="fixed inset-x-0 bottom-0 flex md:hidden bg-gray-50 border-t border-gray-200">
        <div className="flex justify-around w-full">
          {items.map((item) => {
            const IconComponent = item.icon as React.ElementType<{ size: number }>;
            return <Link
              key={item.url}
              href={item.url}
              className="flex flex-col items-center justify-center p-3"
            >
              {item.icon ? <IconComponent size={20} /> : <Image src="/logo.svg" width={20} height={20} alt="logo" />}
            </Link>
          })
          }
          <SignInButton />
        </div>
      </nav>
    </>
  )
}
