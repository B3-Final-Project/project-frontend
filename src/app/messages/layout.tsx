import { ReactNode } from "react";
import { MessagesClientWrapper } from "./MessagesClientWrapper";
import { NotificationsContainer } from "../../components/messages/NotificationsContainer";
import { ConnectionStatus } from "../../components/messages/ConnectionStatus";

export default function MessagesLayout({ children }: { readonly children: ReactNode }) {
  return (
    <MessagesClientWrapper>
      <div className="w-full h-full overflow-hidden">
        {children}
        <NotificationsContainer />
        <ConnectionStatus />
      </div>
    </MessagesClientWrapper>
  );
}
