import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/client.ts';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
export function AppScaffolding(props: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="rcv-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          {props.children}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
