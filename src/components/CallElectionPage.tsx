import { useCallElection } from '@/api/elections';
import { CallElectionForm } from '@/components/CallElectionForm';
import { CallElectionFormData } from '@/lib/schemas';
import { useNavigate } from '@tanstack/react-router';

export function CallElectionPage() {
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
    <div className="mt-8">
      <CallElectionForm
        onFormSubmit={handleFormSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}
