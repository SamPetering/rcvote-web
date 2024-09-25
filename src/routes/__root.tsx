import {
  AuthProviderState,
  useAuth,
} from '@/components/providers/AuthProvider';
import { UserProfileButton } from '@/components/UserProfileButton';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

type RouterContext = {
  auth: AuthProviderState;
};
export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  const { isSignedIn } = useAuth();
  return (
    <div className="flex min-h-screen flex-col antialiased">
      {/* nav */}
      <div className="">
        <div className="mx-auto flex w-full max-w-[64rem] items-center py-2">
          <Link
            to={isSignedIn ? '/home' : '/'}
            className="flex w-fit select-none flex-col items-center text-4xl font-bold"
          >
            rc vote
          </Link>
          <div className="ml-auto">
            <UserProfileButton />
          </div>
        </div>
      </div>
      {/* divider */}
      <hr />
      {/* container div to fill vertical space */}
      <div className="flex grow flex-col">
        {/* main */}
        <main>
          <Outlet />
        </main>
        <footer className="mt-auto">
          <hr />
          <div className="p-4">footer</div>
          <TanStackRouterDevtools />
          <ReactQueryDevtools initialIsOpen={false} />
        </footer>
      </div>
    </div>
  );
}
