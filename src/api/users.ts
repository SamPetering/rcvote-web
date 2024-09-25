import { useRequest } from '@/api';
import { CLIENT_BASE_URL } from '@/api/urls';
import { useUser } from '@/components/providers/AuthProvider';
import { userElectionsResponseSchema } from '@/lib/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';
const userSchema = z.object({
  id: z.number(),
  displayName: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
});
export type User = z.infer<typeof userSchema>;

const userResponseSchema = userSchema.nullable().optional();
export type UserResponse = z.infer<typeof userResponseSchema>;

export function useGetUser() {
  const request = useRequest();
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const res = await request({
          method: 'GET',
          url: `/users/me`,
        });

        return userResponseSchema.parse(res);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 400) {
          // 400 is probably an attempted refresh but the refreshToken was missing, so we log the user out
          return null;
        } else {
          throw e;
        }
      }
    },
    retry: 3,
    staleTime: Infinity,
  });
}

export function useLogout() {
  const request = useRequest();
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      const res = await request({
        method: 'POST',
        url: `/users/me/logout`,
      });
      return res;
    },
    onSuccess: async () => {
      await qc.setQueryData(['me'], null);
      window.location.href = CLIENT_BASE_URL;
    },
  });
}

export function useGetUserCreatedElections() {
  const request = useRequest();
  const user = useUser();

  return useQuery({
    queryKey: ['user', 'elections'],
    queryFn: async () => {
      const res = await request({
        method: 'GET',
        url: `/users/${user.id}/elections`,
      });
      return userElectionsResponseSchema.parse(res);
    },
    retry: false,
    staleTime: Infinity,
  });
}
