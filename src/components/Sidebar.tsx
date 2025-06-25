'use client'
import { signout } from "@/providers/CognitoAuthProvider";
import { Heart, Home, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from "react-oidc-context";



export function SidebarComponent() {
  const auth = useAuth()
  const pathname = usePathname()

  const isActive = (itemUrl: string) => {
    if (itemUrl === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(itemUrl);
  }

  const items = [
    { title: "Home", url: '/', icon: Home },
    { title: "Messages", url: '/messages', icon: MessageSquare },
    { canUse: true, title: "Booster", url: '/boosters', icon: Heart },
    { title: "Profile", url: '/profile', icon: User },
    // { title: "Settings", url: '/register', icon: IoSettingsOutline },
  ]

  const signOutAction = async () => {
    await signout()
    await auth.removeUser()
  }

  return (
    <>
      {/* Desktop Sidebar (visible on md and up) */}
      {/* <div className="hidden md:block md:w-16 lg:w-48">
        <Sidebar className={'md:w-16 lg:w-48'}>
          <SidebarContent>
            <SidebarGroup>
              <div className={'relative mx-auto h-[156px] w-full flex items-center '}>
                <Image src="/logo.png" fill={true} alt="logo" />
              </div>
              <h2 className={clsx('hidden text-xl mx-auto lg:block')}>HOLOMATCH</h2>
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
              </SidebarMenu>
              {auth.user && <Button onClick={() => signOutAction()}>Sign Out</Button>}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div> */}

      {/* Mobile Bottom Navigation (visible on smaller screens) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border border-border px-4 py-2 z-50 mx-5 mb-8 rounded-2xl md:max-w-[750px] md:mx-auto" >
        <div className="flex justify-around items-center mx-auto">
          {items.map((item) => {
            const IconComponent = item.icon as React.ElementType<{ size: number }>;
            return (
              <div
                key={item.url}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg ${isActive(item.url) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <Link
                  href={item.url}
                  className={`flex flex-col items-center justify-center mb-1`}
                >
                  <IconComponent size={24} />
                </Link>

                <p className={`text-xs font-medium ${isActive(item.url) ? 'text-primary' : 'text-muted-foreground'}`}>{item.title}</p>
              </div>
            )
          })
          }
          {/* <SignInButton /> */}
        </div>
      </nav>
    </>
  )
}
