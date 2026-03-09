import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  utilitySubjectState: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
}));

const authMock = vi.hoisted(() => ({
  getServerSession: vi.fn(),
}));

vi.mock("next-auth", () => authMock);
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { GET, POST } from "@/app/api/time-block-planner/route";

describe("time block planner route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    authMock.getServerSession.mockResolvedValue(null);

    const getResponse = await GET();
    expect(getResponse.status).toBe(401);

    const postResponse = await POST(
      new Request("http://localhost/api/time-block-planner", {
        method: "POST",
        body: JSON.stringify({ store: {} }),
      }) as never,
    );
    expect(postResponse.status).toBe(401);
  });

  it("loads the normalized store for the authenticated user", async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.utilitySubjectState.findUnique.mockResolvedValue({
      checklist: {
        "2026-03-08": {
          form: {
            date: "2026-03-08",
            startTime: "09:00",
            endTime: "11:30",
            wantLabel: "Coding",
            wantMinutes: 60,
            shouldLabel: "Cleaning",
            shouldMinutes: 30,
          },
          blocks: [
            {
              id: "want-540-600",
              kind: "want",
              label: "Coding",
              startMinuteOfDay: 540,
              endMinuteOfDay: 600,
            },
          ],
          generatedAt: "2026-03-08T10:00:00.000Z",
        },
      },
      updatedAt: new Date("2026-03-08T10:00:00.000Z"),
    });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(prismaMock.utilitySubjectState.findUnique).toHaveBeenCalledWith({
      where: {
        userId_subjectKey: {
          userId: "user-1",
          subjectKey: "time-block-planner",
        },
      },
      select: {
        checklist: true,
        updatedAt: true,
      },
    });
    expect(payload.store["2026-03-08"].form.activities).toEqual([
      { id: expect.any(String), kind: "want", label: "Coding", minutes: 60 },
      { id: expect.any(String), kind: "should", label: "Cleaning", minutes: 30 },
    ]);
    expect(payload.store["2026-03-08"].blocks[0]).toMatchObject({
      kind: "want",
      label: "Coding",
      durationMinutes: 60,
    });
  });

  it("normalizes and saves the posted store", async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.utilitySubjectState.upsert.mockResolvedValue({
      updatedAt: new Date("2026-03-08T11:00:00.000Z"),
    });

    const response = await POST(
      new Request("http://localhost/api/time-block-planner", {
        method: "POST",
        body: JSON.stringify({
          store: {
            "2026-03-08": {
              form: {
                date: "2026-03-08",
                startTime: "09:00",
                endTime: "11:10",
                wantLabel: " Coding ",
                wantMinutes: 60,
                shouldLabel: " Cleaning ",
                shouldMinutes: 30,
              },
              blocks: [
                {
                  kind: "want",
                  label: " Coding ",
                  startMinuteOfDay: 540,
                  endMinuteOfDay: 600,
                },
              ],
              generatedAt: "2026-03-08T10:00:00.000Z",
            },
            invalid: {
              foo: "bar",
            },
          },
        }),
      }) as never,
    );

    expect(response.status).toBe(200);
    expect(prismaMock.utilitySubjectState.upsert).toHaveBeenCalledWith({
      where: {
        userId_subjectKey: {
          userId: "user-1",
          subjectKey: "time-block-planner",
        },
      },
      create: {
        userId: "user-1",
        subjectKey: "time-block-planner",
        checklist: {
          "2026-03-08": {
            blockNotes: {},
            form: {
              date: "2026-03-08",
              startTime: "09:00",
              endTime: "11:10",
              activities: [
                { id: expect.any(String), kind: "want", label: "Coding", minutes: 60 },
                { id: expect.any(String), kind: "should", label: "Cleaning", minutes: 30 },
              ],
            },
            blocks: [
              {
                id: "want-540-600",
                kind: "want",
                label: "Coding",
                startTime: "09:00",
                endTime: "10:00",
                startMinuteOfDay: 540,
                endMinuteOfDay: 600,
                durationMinutes: 60,
                isTrimmed: false,
              },
            ],
            generatedAt: "2026-03-08T10:00:00.000Z",
          },
        },
        links: [],
      },
      update: {
        checklist: {
          "2026-03-08": {
            blockNotes: {},
            form: {
              date: "2026-03-08",
              startTime: "09:00",
              endTime: "11:10",
              activities: [
                { id: expect.any(String), kind: "want", label: "Coding", minutes: 60 },
                { id: expect.any(String), kind: "should", label: "Cleaning", minutes: 30 },
              ],
            },
            blocks: [
              {
                id: "want-540-600",
                kind: "want",
                label: "Coding",
                startTime: "09:00",
                endTime: "10:00",
                startMinuteOfDay: 540,
                endMinuteOfDay: 600,
                durationMinutes: 60,
                isTrimmed: false,
              },
            ],
            generatedAt: "2026-03-08T10:00:00.000Z",
          },
        },
      },
      select: {
        updatedAt: true,
      },
    });
  });
});
