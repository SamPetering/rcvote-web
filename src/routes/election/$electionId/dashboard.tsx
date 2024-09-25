import { ElectionDashboard } from '@/components/ElectionDashboard';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/election/$electionId/dashboard')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        from: '/election/$electionId/dashboard',
        to: '/login',
      });
    }
  },
  component: ElectionDashboard,
});
