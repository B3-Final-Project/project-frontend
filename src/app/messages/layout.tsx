
import { ReactNode } from "react";

export default function MessagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 w-full h-full overflow-hidden">
      {children}
    </div>
  )
}
