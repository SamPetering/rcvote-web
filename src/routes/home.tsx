import { HomePage } from '@/components/HomePage';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/home')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        from: '/home',
        to: '/login',
      });
    }
  },
  component: HomePage,
});
