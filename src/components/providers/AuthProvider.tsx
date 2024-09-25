import { API_BASE_URL } from '@/api/urls';
import { useGetUser, useLogout, User, UserResponse } from '@/api/users';
import { createContext, ReactNode, useContext } from 'react';

type AuthProviderProps = {
  children: ReactNode;
};
export type AuthProviderState = {
  isSignedIn: boolean;
  isLoading: boolean;
  userResponse: UserResponse;
  login: () => void;
  logout: () => void;
};

const initialState: AuthProviderState = {
  isSignedIn: false,
  isLoading: false,
  userResponse: null,
  login: () => {},
  logout: () => {},
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);
export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const { data: user, isLoading } = useGetUser();
  const { mutateAsync: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/login`;
  };

  return (
    <AuthProviderContext.Provider
      {...props}
      value={{
        isSignedIn: !!user,
        isLoading,
        userResponse: user || null,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthProviderContext);
  if (context === undefined)
    throw new Error('useAuth must be used within an AuthProvider');

  return context;
}

export function useMaybeUser(): User | null {
  const context = useContext(AuthProviderContext);
  if (context === undefined)
    throw new Error('useAuth must be used within an AuthProvider');

  const { userResponse: user } = context;
  return user || null;
}

export function useUser(): User {
  const maybeUser = useMaybeUser();
  if (!maybeUser) throw new Error('No user. Use useMaybeUser instead');
  return maybeUser;
}
