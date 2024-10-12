import { useAuth, useMaybeUser } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import {
  ArrowRightIcon,
  CommandIcon,
  HomeIcon,
  LogOutIcon,
  MoonStarIcon,
  OptionIcon,
  SunIcon,
} from 'lucide-react';

export function UserProfileButton() {
  const { login, logout } = useAuth();
  const user = useMaybeUser();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  if (!user)
    return (
      <Button onClick={login} variant="ghost">
        <div className="inline-flex items-center text-sm font-semibold">
          Log in
          <ArrowRightIcon className="ml-1 w-[.9rem]" />
        </div>
      </Button>
    );

  const initials = user.displayName
    .split(' ')
    .filter(Boolean)
    .map((name) => name[0])
    .filter((_, i, arr) => i === 0 || i === arr.length - 1)
    .map((n) => n.toLocaleUpperCase())
    .join('');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm transition-colors',
          'border-slate-800',
          'dark:border-slate-200'
        )}
      >
        <span className="select-none">{initials}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="min-w-[12rem]"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate({ to: '/home' })}
          className="cursor-pointer space-x-2"
        >
          <HomeIcon className="w-4" />
          <span>Home</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          onClick={toggleTheme}
          className="cursor-pointer space-x-2"
        >
          {theme === 'light' ? (
            <MoonStarIcon className="w-4" />
          ) : (
            <SunIcon className="w-4" />
          )}
          <div className="flex items-center">
            <span>Toggle theme</span>
            <div className="ml-8 flex items-center gap-1 rounded-sm border border-opacity-50 bg-opacity-70 px-2 shadow-sm">
              <CommandIcon className="w-3" />
              <OptionIcon className="w-3" />
              <span className="font-mono text-sm">t</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="cursor-pointer space-x-2">
          <LogOutIcon className="w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
