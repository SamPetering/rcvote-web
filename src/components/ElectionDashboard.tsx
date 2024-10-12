import {
  useActivateElection,
  useGetElectionInfo,
  useGetVoteCount,
} from '@/api/elections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { COLORS } from '@/lib/colors';
import { ElectionInfo } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from '@tanstack/react-router';
import { CircleAlertIcon, PowerIcon, RotateCwIcon } from 'lucide-react';
import { ReactNode } from 'react';

export function ElectionDashboard() {
  const { electionId } = useParams({ from: '/election/$electionId/dashboard' });
  const { data, isLoading, isError } = useGetElectionInfo(electionId);
  const navigate = useNavigate();
  const electionDesc = data?.electionInfo.description;
  const { mutate, isPending } = useActivateElection(electionId);
  const handleActivateClick = () => {
    mutate();
  };
  const status = data?.electionInfo.status;
  return (
    <div className="mx-auto mt-8 max-w-[64rem]">
      <div className="grid grid-cols-4 gap-4">
        <InfoCard
          isLoading={isLoading}
          isError={isError}
          data={
            <div className="w-full space-y-2">
              <h4 className="text-center text-xl">{data?.electionInfo.name}</h4>
              {electionDesc && (
                <ScrollArea className="text-center text-base font-normal">
                  {electionDesc}
                </ScrollArea>
              )}
            </div>
          }
          className="col-span-2"
        />
        <InfoCard
          isLoading={isLoading}
          isError={isError}
          data={
            <div className="flex w-full flex-col items-center gap-4">
              <span>{status}</span>
              {status === 'inactive' && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full bg-election-status-inactive text-white hover:bg-transparent hover:outline hover:outline-1"
                  disabled={isPending}
                  onClick={handleActivateClick}
                >
                  activate
                  <PowerIcon className="ml-2 w-4" />
                </Button>
              )}
            </div>
          }
          title="Status"
          className={cn(
            'text-white',
            status === 'active'
              ? 'bg-election-status-active'
              : status === 'inactive'
                ? 'bg-election-status-inactive'
                : status === 'ended'
                  ? 'bg-election-status-ended'
                  : 'bg-transparent'
          )}
        />
        <VoteCount electionId={electionId} />
        <CandidatesCard
          className="col-span-2"
          candidates={data?.electionInfo.candidates}
        />
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

function CandidatesCard({
  candidates,
  className,
}: {
  candidates?: ElectionInfo['candidates'];
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-center text-lg font-normal">
          Candidates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {candidates?.map((c, i) => {
            return (
              <div
                className="flex items-center gap-2 rounded-md p-3 text-white shadow-md"
                key={c.name + c.color + i}
                style={{ backgroundColor: COLORS[c.color]['600'] }}
              >
                <div className="grow whitespace-nowrap text-sm font-semibold">
                  {c.name}
                </div>
                {c.description && (
                  <ScrollArea
                    maxHeightClassName="max-h-16"
                    className="border-l pl-2 text-sm font-medium dark:border-l-slate-200"
                  >
                    {c.description}
                  </ScrollArea>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
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
}: {
  title?: string;
  data?: ReactNode;
  isLoading: boolean;
  isError: boolean;
  refetch?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className={cn(title ? 'pb-2' : 'pb-0')}>
        {title && (
          <CardTitle className="text-center text-lg font-normal">
            {title}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="h-full">
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
