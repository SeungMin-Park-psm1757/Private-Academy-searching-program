import { z } from "zod";

const subjectSchema = z.enum([
  "math",
  "english",
  "science",
  "korean",
  "coding",
  "essay",
  "social_studies",
  "other",
]);

const teachingStyleSchema = z.enum([
  "concept-first",
  "problem-solving",
  "small-group",
  "intensive",
]);

const distanceBasisSchema = z.enum(["home", "school"]);

const preferredTimeWindowSchema = z
  .object({
    startMinuteOfDay: z.number().int().min(0).max(1439),
    endMinuteOfDay: z.number().int().min(1).max(1440),
  })
  .refine(
    (value) => value.startMinuteOfDay < value.endMinuteOfDay,
    {
      message: "시작 시간은 종료 시간보다 빨라야 합니다.",
      path: ["endMinuteOfDay"],
    },
  );

export const recommendationRequestSchema = z
  .object({
    location: z.object({
      regionCode: z.string().min(1),
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      radiusMeters: z.number().int().min(500).max(10_000),
      distanceBasis: distanceBasisSchema.default("home"),
    }),
    student: z.object({
      gradeBand: z.string().min(1),
      studentProfileId: z.string().min(1).optional(),
    }),
    filters: z.object({
      subjects: z.array(subjectSchema).min(1),
      budgetMinKrw: z.number().int().min(0).optional(),
      budgetMaxKrw: z.number().int().min(0).optional(),
      preferredWeekdays: z.array(z.number().int().min(0).max(6)).optional().default([]),
      preferredTimeWindow: preferredTimeWindowSchema.optional(),
      teachingStyles: z.array(teachingStyleSchema).optional().default([]),
      needsShuttleSupport: z.boolean().optional().default(false),
    }),
    freeText: z
      .string()
      .max(800)
      .optional()
      .transform((value) => value?.replace(/[<>]/g, "").replace(/\s+/g, " ").trim() ?? ""),
  })
  .superRefine((value, ctx) => {
    const { budgetMinKrw, budgetMaxKrw } = value.filters;

    if (
      budgetMinKrw != null &&
      budgetMaxKrw != null &&
      budgetMinKrw > budgetMaxKrw
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["filters", "budgetMaxKrw"],
        message: "최대 예산은 최소 예산보다 크거나 같아야 합니다.",
      });
    }
  });

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>;
