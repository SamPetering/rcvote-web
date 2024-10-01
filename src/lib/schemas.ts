import { z } from 'zod';

export const colorSchema = z.union([
  z.literal('red'),
  z.literal('orange'),
  z.literal('amber'),
  z.literal('yellow'),
  z.literal('lime'),
  z.literal('green'),
  z.literal('emerald'),
  z.literal('teal'),
  z.literal('cyan'),
  z.literal('sky'),
  z.literal('blue'),
  z.literal('violet'),
  z.literal('purple'),
  z.literal('fuchsia'),
  z.literal('pink'),
  z.literal('rose'),
]);
export type COLOR = z.infer<typeof colorSchema>;

export const idResponseSchema = z.object({
  success: z.boolean(),
  id: z.union([z.string(), z.number()]),
});
export const idsResponseSchema = z.object({
  success: z.boolean(),
  ids: z.array(idResponseSchema.shape.id),
});
export const boolResponseSchema = z.object({
  success: z.boolean(),
  value: z.boolean(),
});

export const ELECTION_NAME_MAX_LENGTH = 2 ** 6; // 64
export const ELECTION_DESCRIPTION_MAX_LENGTH = 2 ** 10; // 1028

export const CANDIDATES_MAX_LENGTH = 2 ** 5; // 32
export const CANDIDATES_MIN_LENGTH = 2; // 2
export const CANDIDATE_NAME_MAX_LENGTH = 2 ** 6; // 64
export const CANDIDATE_DESCRIPTION_MAX_LENGTH = 2 ** 8; // 256

const putCandidateSchema = z.object({
  name: z.string().min(1).max(CANDIDATE_NAME_MAX_LENGTH),
  color: colorSchema,
  description: z.string().max(CANDIDATE_DESCRIPTION_MAX_LENGTH).optional(),
});

export const callElectionFormSchema = z.object({
  name: z.string().min(3).max(ELECTION_NAME_MAX_LENGTH),
  description: z.string().max(ELECTION_DESCRIPTION_MAX_LENGTH).optional(),
  startDate: z.date(),
  endDate: z.date(),
  candidateDescriptions: z.boolean(),
  candidates: z
    .array(putCandidateSchema)
    .min(CANDIDATES_MIN_LENGTH)
    .max(CANDIDATES_MAX_LENGTH),
});
export type CallElectionFormData = z.infer<typeof callElectionFormSchema>;

export const callElectionDataSchema = z.object({
  electionConfig: callElectionFormSchema.omit({ candidateDescriptions: true }),
});
export type CallElectionData = z.infer<typeof callElectionDataSchema>;

export const ballotResponseSchema = z.object({
  success: z.boolean(),
  ballot: z.object({
    electionInfo: z.object({
      name: z.string(),
      description: z.string().nullable(),
      endDate: z.coerce.date().nullable(),
    }),
    candidates: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        color: colorSchema,
        description: z.string().nullable(),
      })
    ),
  }),
});
export type BallotResponse = z.infer<typeof ballotResponseSchema>;

export const castBallotDataSchema = z.object({
  electionId: z.string(),
  voterId: z.number(),
  rankings: z.array(
    z.object({
      candidateId: z.number(),
      rank: z.number(),
    })
  ),
});
export type CastBallotData = z.infer<typeof castBallotDataSchema>;

export const ballotFormSchema = z.object({
  electionId: z.string(),
  voterId: z.number(),
  candidates: ballotResponseSchema.shape.ballot.shape.candidates,
});
export type BallotFormData = z.infer<typeof ballotFormSchema>;

const electionStatusSchema = z.union([
  z.literal('inactive'),
  z.literal('active'),
  z.literal('ended'),
]);
export type ElectionStatus = z.infer<typeof electionStatusSchema>;

export const electionInfoResponseSchema = z.object({
  success: z.boolean(),
  electionInfo: z.object({
    name: z.string(),
    status: electionStatusSchema,
    candidates: z.array(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        color: colorSchema,
      })
    ),
    description: z.string().nullable(),
  }),
});
export type ElectionInfo = z.infer<
  typeof electionInfoResponseSchema.shape.electionInfo
>;

export const voteCountResponseSchema = z.object({
  success: z.boolean(),
  voteCount: z.number(),
});

const dateStringCoerce = z.coerce.date();

export const userElectionsResponseSchema = z.object({
  success: z.boolean(),
  elections: z.array(
    z.object({
      id: z.string(),
      createdAt: dateStringCoerce,
      updatedAt: dateStringCoerce,
      status: electionStatusSchema,
      config: z.object({
        name: z.string(),
        createdAt: dateStringCoerce,
        updatedAt: dateStringCoerce,
        description: z.string().nullable(),
        startDate: dateStringCoerce,
        endDate: dateStringCoerce,
      }),
      candidates: z
        .array(
          z.object({
            id: z.number(),
            name: z.string(),
            description: z.string().nullable(),
            color: colorSchema,
          })
        )
        .nullable(),
      voteCount: z.number(),
    })
  ),
});
export type UserElections = z.infer<
  typeof userElectionsResponseSchema.shape.elections
>;
export type UserElectionsResponse = z.infer<typeof userElectionsResponseSchema>;
