import { useGetElectionInfo } from '@/api/elections';
import { ElectionDashboard } from '@/components/ElectionDashboard';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Helmet } from 'react-helmet';

export function ElectionDashboardPage() {
  const navigate = useNavigate();
  const { electionId } = useParams({ from: '/election/$electionId/dashboard' });
  const { data, isLoading, isError } = useGetElectionInfo(electionId);
  return (
    <div className="mx-auto mt-8 max-w-[64rem]">
      <Helmet>
        <title>{`Dashboard: ${data?.electionInfo.name}`}</title>
      </Helmet>
      <ElectionDashboard
        electionId={electionId}
        electionInfo={data?.electionInfo}
        isLoading={isLoading}
        isError={isError}
      />
      <br />
      <Button
        onClick={() => {
          navigate({
            from: '/election/$electionId/dashboard',
            to: '/election/$electionId/vote',
            params: { electionId },
          });
        }}
      >
        vote
      </Button>
    </div>
  );
}
