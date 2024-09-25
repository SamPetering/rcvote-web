import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isSignedIn) {
      throw redirect({
        from: '/login',
        to: '/home',
      });
    }
  },
  component: Login,
});

function Login() {
  const { login } = useAuth();
  return (
    <div className="mx-auto mt-24 w-fit">
      <Button onClick={login}>
        <div className="inline-flex items-center text-sm font-semibold">
          Log in with Google
          <ArrowRightIcon className="ml-1 w-4" />
        </div>
      </Button>
    </div>
  );
}
