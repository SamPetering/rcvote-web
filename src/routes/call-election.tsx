import { useCallElection } from '@/api/elections';
import { CallElectionForm } from '@/components/CallElectionForm';
import type { CallElectionFormData } from '@/lib/schemas';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/call-election')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isSignedIn) {
      throw redirect({
        from: '/call-election',
        to: '/login',
      });
    }
  },
  component: CallElection,
});

function CallElection() {
  const { mutateAsync, isPending } = useCallElection();
  const navigate = useNavigate();

  const handleFormSubmit = async (form: CallElectionFormData) => {
    const { id } = await mutateAsync({
      electionConfig: form,
    });
    navigate({
      from: '/call-election',
      to: '/election/$electionId/dashboard',
      params: { electionId: id.toString() },
    });
  };
  return (
    <CallElectionForm
      onFormSubmit={handleFormSubmit}
      isSubmitting={isPending}
    />
  );
}
