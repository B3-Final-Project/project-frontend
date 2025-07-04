import { ReactNode } from "react";
import { MessagesClientWrapper } from "../../providers/MessagesClientWrapper";
import { ConnectionStatus } from "../../components/messages/ConnectionStatus";

export default function MessagesLayout({ children }: { readonly children: ReactNode }) {
  return (
    <MessagesClientWrapper>
      <div className="w-full h-full overflow-hidden">
        {children}
        <ConnectionStatus />
      </div>
    </MessagesClientWrapper>
  );
}
