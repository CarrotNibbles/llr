'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const queryClient = new QueryClient();

export default function ReactQueryClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0, // 1 minute
        },
      },
    });
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
