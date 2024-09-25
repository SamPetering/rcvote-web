import {
  useActivateElection,
  useGetElectionInfo,
  useGetVoteCount,
} from '@/api/elections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COLORS } from '@/lib/colors';
import { ElectionInfo } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from '@tanstack/react-router';
import { CircleAlertIcon, RotateCwIcon } from 'lucide-react';
import { ReactNode } from 'react';

export function ElectionDashboard() {
  const { electionId } = useParams({ from: '/election/$electionId/dashboard' });
  const { data, isLoading, isError } = useGetElectionInfo(electionId);
  const navigate = useNavigate();
  const active = data?.electionInfo.status === 'active';
  return (
    <div className="mx-auto mt-8 max-w-[64rem]">
      <div className="grid grid-cols-4 gap-4">
        <InfoCard
          isLoading={isLoading}
          isError={isError}
          data={
            <div className="space-y-2">
              <h4 className="text-xl">{data?.electionInfo.name}</h4>
              <p className="text-base font-normal">
                {/* TODO: ADD DESCRIPTION AND COUNT TO ELECTION INFO RESPONSE */}
                my election description! it's really really really really really
                really long
              </p>
            </div>
          }
          className="col-span-2"
          // noPadding={true}
        />
        <InfoCard
          isLoading={isLoading}
          isError={isError}
          data={
            active === true ? 'Active' : active === false ? 'Inactive' : 'Ended'
          }
          title="Status"
          className={cn(
            'text-white',
            active === true
              ? 'bg-election-status-active'
              : active === false
                ? 'bg-election-status-inactive'
                : 'bg-election-status-ended'
          )}
        />
        <VoteCount electionId={electionId} />
      </div>
      <div>
        {isLoading || (!data && 'loading info...')}
        {isError && 'error getting info'}
        {data && <ElectionInfoDisplay info={data.electionInfo} />}
      </div>
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

function ElectionInfoDisplay({ info }: { info: ElectionInfo }) {
  const { electionId } = useParams({ from: '/election/$electionId/dashboard' });
  const { mutate, isPending } = useActivateElection(electionId);
  const handleActivateClick = () => {
    mutate();
  };
  return (
    <div>
      <h2>Election Info:</h2>
      <div>Name: {info.name}</div>
      <div className="flex items-center gap-2">
        <div>Status: {info.status}</div>
        {info.status !== 'active' && (
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={handleActivateClick}
          >
            activate
          </Button>
        )}
      </div>
      <div>
        <h3>Candidates:</h3>
        <div className="flex flex-col gap-2">
          {info.candidates.map((c) => {
            return (
              <div key={c.name}>
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: COLORS[c.color][500] }}
                    className="h-4 w-4"
                  />
                  <div>{c.name}</div>
                </div>
                {c.description && <div className="pl-2">{c.description}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VoteCount({ electionId }: { electionId: string }) {
  const { data, isLoading, isError, refetch } = useGetVoteCount(electionId);
  return (
    <InfoCard
      title="Votes"
      data={data?.voteCount}
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
    />
  );
}

function InfoCard({
  title,
  data,
  isLoading,
  isError,
  refetch,
  className,
  noPadding,
}: {
  title?: string;
  data?: ReactNode;
  isLoading: boolean;
  isError: boolean;
  refetch?: () => void;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className={cn(title ? 'pb-2' : 'pb-0', noPadding && 'p-0')}>
        {title && (
          <CardTitle className="text-center text-lg font-normal">
            {title}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className={cn(noPadding && 'p-0', 'h-full')}>
        {isError ? (
          <div className="flex h-8 items-center">
            <div className="flex items-center justify-center gap-2 rounded-md bg-destructive px-3 py-1 font-semibold text-destructive-foreground shadow-sm">
              <CircleAlertIcon className="h-4 w-4" />
              Error
            </div>
            {refetch && (
              <Button
                onClick={refetch}
                className="ml-auto h-full"
                variant="ghost"
                size="icon"
              >
                <RotateCwIcon className="h-4" />
              </Button>
            )}
          </div>
        ) : isLoading ? (
          <div className="h-8 w-12 animate-pulse rounded-md bg-secondary" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-2xl font-bold">
            {data}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
