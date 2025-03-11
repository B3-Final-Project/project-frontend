"use client"
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";

interface QueryClientProviderProps {
  readonly children: React.ReactNode;
}

export default function ReactQueryClientProvider({ children }: QueryClientProviderProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
