import { CallElectionPage } from '@/components/CallElectionPage';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/call-election')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        from: '/call-election',
        to: '/login',
      });
    }
  },
  component: CallElectionPage,
});
