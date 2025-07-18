import { ReactNode } from "react";

export default function MessagesLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className="w-full h-full overflow-hidden">
      {children}
    </div>
  );
}
