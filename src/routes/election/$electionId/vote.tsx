import { useCastBallot, useGetBallot, useGetHasVoted } from '@/api/elections';
import { BallotForm } from '@/components/BallotForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BallotFormData } from '@/lib/schemas';
import {
  createFileRoute,
  redirect,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useRef, useState } from 'react';

export const Route = createFileRoute('/election/$electionId/vote')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        from: '/election/$electionId/vote',
        to: '/login',
      });
    }
  },
  component: Vote,
});

function Vote() {
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const { electionId } = useParams({ from: '/election/$electionId/vote' });
  const [voterId, setVoterId] = useState(1);
  const getHasVoted = useGetHasVoted(electionId, voterId);
  const { data, isError, isLoading, isSuccess } = useGetBallot(electionId);
  const { mutateAsync, isPending } = useCastBallot(electionId, voterId);
  if (isLoading) return 'loading ballot...';
  if (isError || !isSuccess) return 'error x__x';
  if (getHasVoted.error) return 'error getting voting record';
  if (getHasVoted.isLoading || !getHasVoted.data)
    return 'loading voting record...';
  const hasVoted = getHasVoted.data.value;

  const handleFormSubmit = async (form: BallotFormData) => {
    const res = await mutateAsync({
      electionId: form.electionId,
      voterId: form.voterId,
      rankings: form.candidates.map((c, i) => ({ candidateId: c.id, rank: i })),
    });
    console.log(res);
  };

  return hasVoted ? (
    <div className="mx-auto max-w-[64rem]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ref.current) {
            setVoterId(Number(ref.current?.value));
          }
        }}
      >
        <div className="flex w-fit flex-col gap-2">
          <div>{`${voterId} has already voted`}</div>
          <Button
            onClick={() => {
              navigate({
                from: '/election/$electionId/vote',
                to: '/election/$electionId/dashboard',
                params: { electionId },
              });
            }}
          >
            go to dashboard
          </Button>
        </div>
        <br />
        <div className="flex max-w-sm gap-2">
          <Input ref={ref} placeholder="new voter id" />
          <Button type="submit">update</Button>
        </div>
      </form>
    </div>
  ) : (
    <BallotForm
      voterId={voterId}
      ballot={data.ballot}
      onFormSubmit={handleFormSubmit}
      electionId={electionId}
      isSubmitting={isPending}
    />
  );
}
