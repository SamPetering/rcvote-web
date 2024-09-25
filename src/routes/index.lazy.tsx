import { LandingPage } from '@/components/LandingPage';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: LandingPage,
});
