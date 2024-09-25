import { RanksVisualizer } from '@/components/RanksVisualizer';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export function LandingPage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate({ from: '/', to: '/home' });
  };
  return (
    <div className="mt-24">
      <div className="mx-auto flex max-w-[60rem] flex-col items-center justify-evenly gap-4 sm:flex-row">
        <div className="max-w-[32rem] space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            A Better Way to Vote. Rank Your Choices and Make Your Vote Count.
          </h1>
          <p className="max-w-[30rem]">
            Create elections with ranked choice ballots to ensure every vote
            truly matters. Experience democracy made clear, fair, and easy.
          </p>
          <Button onClick={handleClick}>Get started</Button>
        </div>
        <div className="w-full max-w-[20rem] sm:max-w-[16rem]">
          <RanksVisualizer />
        </div>
      </div>
    </div>
  );
}
