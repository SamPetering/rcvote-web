import { useActivateElection, useDeleteElection } from '@/api/elections';
import { CLIENT_BASE_URL } from '@/api/urls';
import { useGetUserCreatedElections } from '@/api/users';
import { Tooltip } from '@/components/Tooltip';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { COLORS } from '@/lib/colors';
import { UserElections } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  EllipsisVertical,
  LinkIcon,
  LoaderIcon,
  PlusIcon,
  UserIcon,
  VoteIcon,
} from 'lucide-react';
import range from 'lodash/range';
import { ScrollArea } from '@/components/ui/scroll-area';

const Skeleton = () => (
  <div className="h-48 animate-pulse rounded-md bg-secondary" />
);

export function HomePage() {
  const { data, isLoading, isError } = useGetUserCreatedElections();
  if (isError) return 'error';
  return (
    <div className="mx-auto mt-8 max-w-[64rem]">
      {/* elections */}
      <div className="space-y-4">
        <Label className="text-4xl">Your Elections</Label>
        <div className="grid grid-cols-3 gap-4">
          {isLoading && range(0, 6).map((i) => <Skeleton key={i} />)}
          {data && (
            <>
              <CreateElectionCard />
              {data.elections.map((e) => (
                <ElectionCard key={e.id} election={e} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getVoteLink(election: UserElections[number]) {
  return `${CLIENT_BASE_URL}/election/${election.id}/vote`;
}

function ElectionCard({ election }: { election: UserElections[number] }) {
  const voteCount = election.voteCount;
  const candidates = election.candidates;
  const candidateCount = candidates?.length ?? 0;
  const { toast } = useToast();
  const handleCopyLinkClick = () => {
    navigator.clipboard.writeText(getVoteLink(election));
    toast({ title: 'Copied to clipboard' });
  };
  return (
    <Card className="flex h-52 flex-col">
      <CardHeader className="pb-2">
        <div className="flex">
          <CardTitle className="overflow-hidden pr-2">
            <Link
              from="/home"
              to="/election/$electionId/dashboard"
              params={{ electionId: election.id }}
            >
              <h3 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-xl">
                {election.config?.name ?? '----'}
              </h3>
            </Link>
          </CardTitle>
          <div className="ml-auto">
            <StatusAction status={election.status} electionId={election.id} />
          </div>
        </div>
        <CardDescription>
          <ScrollArea className="h-16">
            {election.config?.description}
          </ScrollArea>
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="grid grid-cols-2 gap-2">
          {/* candidates */}
          {candidates && (
            <Tooltip
              content={
                <div className="space-y-2">
                  {candidates.map((c) => (
                    <div key={c.id} className="">
                      <div className="flex items-center gap-2">
                        <div
                          style={{ backgroundColor: COLORS[c.color]['500'] }}
                          className="h-4 w-4 rounded-sm shadow-sm"
                        />
                        <span>{c.name}</span>
                      </div>
                      <p>{c.description}</p>
                    </div>
                  ))}
                </div>
              }
            >
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="w-5" />
                <span>{`${candidateCount} candidates`}</span>
              </div>
            </Tooltip>
          )}
          {/* votes */}
          <div className="flex items-center gap-2 text-sm">
            <VoteIcon className="w-5" />
            <span>{`${voteCount} votes`}</span>
          </div>
          {/* share link */}
          <button
            className="flex items-center gap-2 text-sm"
            onClick={handleCopyLinkClick}
          >
            <LinkIcon className="w-5" />
            Copy link
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusAction({
  status,
  electionId,
}: {
  status: 'active' | 'ended' | 'inactive';
  electionId: string;
}) {
  const activateElection = useActivateElection(electionId);
  const deleteElection = useDeleteElection(electionId);
  return (
    <div
      className={cn(
        'flex h-fit max-h-6 items-center rounded-md text-xs font-extrabold text-white shadow-sm',
        status === 'active'
          ? 'bg-green-600'
          : status === 'inactive'
            ? 'bg-election-status-inactive'
            : 'bg-election-status-ended'
      )}
    >
      <div className="border-r-2 border-border px-2 py-1">{status}</div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'w-fit rounded-none rounded-r-md px-2 hover:text-white',
            status === 'active' ? 'hover:bg-green-700' : 'hover:bg-amber-800'
          )}
        >
          <EllipsisVertical className="w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DropdownMenuLabel>Election Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={status === 'active'}
            onClick={() => activateElection.mutate()}
            className="cursor-pointer"
          >
            Activate
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteElection.isPending}
            onClick={() => deleteElection.mutate()}
            className="cursor-pointer focus:bg-destructive focus:text-white"
          >
            Delete
            <LoaderIcon
              className={cn(
                'hidden h-4 animate-spin',
                deleteElection.isPending && 'visible'
              )}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function CreateElectionCard() {
  const navigate = useNavigate();
  return (
    <Card>
      <Button
        onClick={() =>
          navigate({
            to: '/call-election',
          })
        }
        variant="secondary"
        className="h-full w-full"
      >
        <div className="flex items-center gap-2 text-2xl">
          <PlusIcon strokeWidth={2.5} />
          <span>Create New</span>
        </div>
      </Button>
    </Card>
  );
}
