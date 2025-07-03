import { ReactNode } from "react";
import { MessagesClientWrapper } from "../../providers/MessagesClientWrapper";

export default function MessagesLayout({ children }: { readonly children: ReactNode }) {
  return (
    <MessagesClientWrapper>
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>
    </MessagesClientWrapper>
  );
}
