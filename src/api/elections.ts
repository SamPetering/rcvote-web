import { useRequest } from '@/api';
import { useToast } from '@/hooks/use-toast';
import {
  ballotResponseSchema,
  boolResponseSchema,
  CallElectionData,
  callElectionDataSchema,
  CastBallotData,
  castBallotDataSchema,
  electionInfoResponseSchema,
  idResponseSchema,
  idsResponseSchema,
  UserElectionsResponse,
  voteCountResponseSchema,
} from '@/lib/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCallElection() {
  const request = useRequest();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CallElectionData) => {
      const res = await request({
        method: 'PUT',
        url: `/elections/call`,
        data: callElectionDataSchema.parse(data),
      });
      return idResponseSchema.parse(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['user', 'elections'] });
    },
  });
}

export function useGetBallot(electionId: string) {
  const request = useRequest();
  return useQuery({
    queryKey: ['ballot', electionId],
    queryFn: async () => {
      const res = await request({
        method: 'GET',
        url: `/elections/${electionId}/ballot`,
      });
      return ballotResponseSchema.parse(res);
    },
  });
}

export function useCastBallot(electionId: string, voterId: number) {
  const qc = useQueryClient();
  const request = useRequest();
  return useMutation({
    mutationFn: async (data: CastBallotData) => {
      const res = await request({
        method: 'PUT',
        url: `/elections/${electionId}/votes`,
        data: castBallotDataSchema.parse(data),
      });
      return idResponseSchema.parse(res);
    },
    onError: (e) => {
      console.log('error casting ballot', e);
    },
    onSuccess: () => {
      console.log('success!');
      qc.invalidateQueries({ queryKey: ['voted', electionId, voterId] });
    },
  });
}

export function useActivateElection(electionId: string) {
  const qc = useQueryClient();
  const request = useRequest();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await request({
        method: 'PUT',
        url: `/elections/${electionId}/activate`,
      });
      return boolResponseSchema.parse(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['electionInfo', electionId] });
      qc.setQueryData(['user', 'elections'], (data: UserElectionsResponse) => {
        const electionIdx = data.elections.findIndex(
          (e) => e.id === electionId
        );
        if (electionIdx >= 0) {
          const updatedElections = [...data.elections];
          updatedElections[electionIdx] = {
            ...updatedElections[electionIdx],
            status: 'active',
          };
          return {
            ...data,
            elections: updatedElections,
          };
        }
        return data;
      });
      toast({
        title: 'Election activated',
      });
    },
  });
}

export function useGetHasVoted(electionId: string, voterId: number) {
  const request = useRequest();
  return useQuery({
    queryKey: ['voted', electionId, voterId],
    queryFn: async () => {
      const res = await request({
        method: 'GET',
        url: `/elections/${electionId}/${voterId}/voted`,
      });
      return boolResponseSchema.parse(res);
    },
  });
}

export function useGetElectionInfo(electionId: string) {
  const request = useRequest();
  return useQuery({
    queryKey: ['electionInfo', electionId],
    queryFn: async () => {
      const res = await request({
        method: 'GET',
        url: `/elections/${electionId}/info`,
      });
      return electionInfoResponseSchema.parse(res);
    },
  });
}

export function useGetVoteCount(electionId: string) {
  const request = useRequest();
  return useQuery({
    queryKey: ['electionVoteCount', electionId],
    queryFn: async () => {
      const res = await request({
        method: 'GET',
        url: `/elections/${electionId}/votes/count`,
      });
      return voteCountResponseSchema.parse(res);
    },
    retry: 1,
  });
}

export function useDeleteElection(electionId: string) {
  const request = useRequest();
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await request({
        method: 'DELETE',
        url: `/elections/${electionId}`,
      });
      const p = idsResponseSchema.parse(res);
      return p;
    },
    onSuccess: ({ ids }) => {
      qc.setQueryData<UserElectionsResponse>(['user', 'elections'], (prev) => {
        return prev
          ? {
              ...prev,
              elections: prev?.elections.filter((e) => !ids.includes(e.id)),
            }
          : prev;
      });
      toast({
        title: 'Election deleted',
      });
    },
    onError: () => {
      toast({
        title: 'Error deleting election',
        variant: 'destructive',
      });
    },
  });
}
