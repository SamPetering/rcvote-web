import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import { routeTree } from '@/routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { AppScaffolding } from '@/components/AppScaffolding';
import { useAuth } from '@/components/providers/AuthProvider';

const router = createRouter({
  routeTree,
  context: {
    // initially undefined, need to pass down the auth state from within a react component
    auth: undefined!,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  if (auth.isLoading)
    return (
      <div className="flex h-screen animate-pulse flex-col items-center justify-center">
        Authenticating...
      </div>
    );
  return <RouterProvider router={router} context={{ auth }} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppScaffolding>
      <InnerApp />
    </AppScaffolding>
  </React.StrictMode>
);
