import { describe, expect, it } from "vitest";
import { RecommendationRepositoryPort } from "../ports/recommendation-repository.port";
import { GetTopRecommendationsUseCase } from "./get-top-recommendations.use-case";

describe("GetTopRecommendationsUseCase", () => {
  it("keeps one public result per organization before filling Top 3", async () => {
    const repository: RecommendationRepositoryPort = {
      async findCandidates() {
        return [
          {
            classGroupId: "a1",
            programId: "program-a1",
            organizationId: "org-a",
            branchId: "branch-a1",
            regionCode: "seoul-gangnam",
            academyName: "A",
            branchName: "A1",
            programName: "P1",
            classGroupName: "C1",
            subject: "math",
            gradeBand: "middle-2",
            deliveryMode: "offline",
            monthlyFeeKrw: 300000,
            homeDistanceMeters: 1000,
            schoolDistanceMeters: 900,
            supportsShuttle: true,
            teachingStyles: ["concept-first"],
            schedules: [{ weekday: 1, startMinuteOfDay: 1140, endMinuteOfDay: 1260 }],
            maxCapacity: 10,
            minOpenThreshold: 2,
            reportedEnrolledCount: 6,
            reservedCount: 0,
            acceptsWaitlist: true,
            freshnessDays: 3,
            verified: true,
            sourceType: "admin_verified",
            reviewStatus: "published",
            messageEnabled: true,
          },
          {
            classGroupId: "a2",
            programId: "program-a2",
            organizationId: "org-a",
            branchId: "branch-a2",
            regionCode: "seoul-gangnam",
            academyName: "A",
            branchName: "A2",
            programName: "P2",
            classGroupName: "C2",
            subject: "math",
            gradeBand: "middle-2",
            deliveryMode: "offline",
            monthlyFeeKrw: 290000,
            homeDistanceMeters: 1300,
            schoolDistanceMeters: 1100,
            supportsShuttle: false,
            teachingStyles: ["concept-first"],
            schedules: [{ weekday: 1, startMinuteOfDay: 1140, endMinuteOfDay: 1260 }],
            maxCapacity: 10,
            minOpenThreshold: 2,
            reportedEnrolledCount: 6,
            reservedCount: 0,
            acceptsWaitlist: true,
            freshnessDays: 4,
            verified: true,
            sourceType: "admin_verified",
            reviewStatus: "published",
            messageEnabled: true,
          },
          {
            classGroupId: "b1",
            programId: "program-b1",
            organizationId: "org-b",
            branchId: "branch-b1",
            regionCode: "seoul-gangnam",
            academyName: "B",
            branchName: "B1",
            programName: "P3",
            classGroupName: "C3",
            subject: "math",
            gradeBand: "middle-2",
            deliveryMode: "offline",
            monthlyFeeKrw: 310000,
            homeDistanceMeters: 1400,
            schoolDistanceMeters: 800,
            supportsShuttle: true,
            teachingStyles: ["concept-first"],
            schedules: [{ weekday: 1, startMinuteOfDay: 1140, endMinuteOfDay: 1260 }],
            maxCapacity: 10,
            minOpenThreshold: 2,
            reportedEnrolledCount: 6,
            reservedCount: 0,
            acceptsWaitlist: true,
            freshnessDays: 2,
            verified: true,
            sourceType: "admin_verified",
            reviewStatus: "published",
            messageEnabled: true,
          },
          {
            classGroupId: "c1",
            programId: "program-c1",
            organizationId: "org-c",
            branchId: "branch-c1",
            regionCode: "seoul-gangnam",
            academyName: "C",
            branchName: "C1",
            programName: "P4",
            classGroupName: "C4",
            subject: "math",
            gradeBand: "middle-2",
            deliveryMode: "offline",
            monthlyFeeKrw: 320000,
            homeDistanceMeters: 1600,
            schoolDistanceMeters: 1200,
            supportsShuttle: true,
            teachingStyles: ["concept-first"],
            schedules: [{ weekday: 1, startMinuteOfDay: 1140, endMinuteOfDay: 1260 }],
            maxCapacity: 10,
            minOpenThreshold: 2,
            reportedEnrolledCount: 6,
            reservedCount: 0,
            acceptsWaitlist: true,
            freshnessDays: 1,
            verified: true,
            sourceType: "admin_verified",
            reviewStatus: "published",
            messageEnabled: true,
          },
        ];
      },
      async saveRecommendationSession() {
        throw new Error("Not used in this test.");
      },
      async getRecommendationSession() {
        return null;
      },
    };

    const useCase = new GetTopRecommendationsUseCase(repository);
    const result = await useCase.execute({
      regionCode: "seoul-gangnam",
      requestedLat: 37.5,
      requestedLng: 127.04,
      radiusMeters: 3000,
      distanceBasis: "home",
      subject: ["math"],
      gradeBand: "middle-2",
      budgetMinKrw: 200000,
      budgetMaxKrw: 350000,
      preferredWeekdays: [1],
      preferredTimeWindow: {
        startMinuteOfDay: 1140,
        endMinuteOfDay: 1320,
      },
      needsShuttleSupport: false,
      teachingStyles: ["concept-first"],
    });

    expect(result.publicTop3).toHaveLength(3);
    expect(new Set(result.publicTop3.map((item) => item.organizationId)).size).toBe(3);
  });

  it("penalizes academies without shuttle support when the parent requires it", async () => {
    const repository: RecommendationRepositoryPort = {
      async findCandidates() {
        return [
          {
            classGroupId: "shuttle-on",
            programId: "program-1",
            organizationId: "org-a",
            branchId: "branch-a",
            regionCode: "seoul-gangnam",
            academyName: "Shuttle Academy",
            branchName: "A",
            programName: "P1",
            classGroupName: "C1",
            subject: "math",
            gradeBand: "middle-2",
            deliveryMode: "offline",
            monthlyFeeKrw: 300000,
            homeDistanceMeters: 2800,
            schoolDistanceMeters: 1500,
            supportsShuttle: true,
            teachingStyles: ["concept-first"],
            schedules: [{ weekday: 1, startMinuteOfDay: 1140, endMinuteOfDay: 1260 }],
            maxCapacity: 10,
            minOpenThreshold: 2,
            reportedEnrolledCount: 5,
            reservedCount: 0,
            acceptsWaitlist: true,
            freshnessDays: 5,
            verified: true,
            sourceType: "admin_verified",
            reviewStatus: "published",
            messageEnabled: true,
          },
          {
            classGroupId: "shuttle-off",
            programId: "program-2",
            organizationId: "org-b",
            branchId: "branch-b",
            regionCode: "seoul-gangnam",
            academyName: "No Shuttle Academy",
            branchName: "B",
            programName: "P2",
            classGroupName: "C2",
            subject: "math",
            gradeBand: "middle-2",
            deliveryMode: "offline",
            monthlyFeeKrw: 300000,
            homeDistanceMeters: 2200,
            schoolDistanceMeters: 1400,
            supportsShuttle: false,
            teachingStyles: ["concept-first"],
            schedules: [{ weekday: 1, startMinuteOfDay: 1140, endMinuteOfDay: 1260 }],
            maxCapacity: 10,
            minOpenThreshold: 2,
            reportedEnrolledCount: 5,
            reservedCount: 0,
            acceptsWaitlist: true,
            freshnessDays: 5,
            verified: true,
            sourceType: "admin_verified",
            reviewStatus: "published",
            messageEnabled: true,
          },
        ];
      },
      async saveRecommendationSession() {
        throw new Error("Not used in this test.");
      },
      async getRecommendationSession() {
        return null;
      },
    };

    const useCase = new GetTopRecommendationsUseCase(repository);
    const result = await useCase.execute({
      regionCode: "seoul-gangnam",
      requestedLat: 37.5,
      requestedLng: 127.04,
      radiusMeters: 3000,
      distanceBasis: "home",
      subject: ["math"],
      gradeBand: "middle-2",
      preferredWeekdays: [1],
      preferredTimeWindow: {
        startMinuteOfDay: 1140,
        endMinuteOfDay: 1320,
      },
      needsShuttleSupport: true,
      teachingStyles: ["concept-first"],
    });

    expect(result.publicTop3[0]?.classGroupId).toBe("shuttle-on");
    expect(result.publicTop3[1]?.classGroupId).toBe("shuttle-off");
    expect(result.publicTop3[1]?.warningCodes).toContain("NO_SHUTTLE_SUPPORT");
  });
});
