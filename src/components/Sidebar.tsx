"use client";
import { Heart, Home, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ]

  const groups = auth.user?.profile['cognito:groups'] as string[];
  const isAdmin = groups?.includes('admin') ?? false;

  return (
    <>
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
          {isAdmin && (
            // admin?dashboard or admin?users
            <div className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg ${pathname.startsWith('/admin') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
              <Link href="/admin?dashboard" className="flex flex-col items-center justify-center mb-1">
                <Heart size={24} />
              </Link>
              <p className={`text-xs font-medium ${pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>Admin</p>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
