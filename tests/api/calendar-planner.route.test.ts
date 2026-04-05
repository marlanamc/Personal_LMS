import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  utilitySubjectState: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
  workspaceContext: {
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

import { GET, POST } from "@/app/api/calendar-planner/route";

describe("calendar planner route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns acknowledgement-only days from the server", async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.utilitySubjectState.findUnique.mockResolvedValue({
      checklist: {
        "2026-04-05": {
          notes: "",
          tasks: [],
          acknowledgements: {
            boundaries: ["boundary-1"],
            events: [],
            sessions: [],
          },
        },
      },
      updatedAt: new Date("2026-04-05T12:00:00.000Z"),
    });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.store["2026-04-05"]).toMatchObject({
      acknowledgements: {
        boundaries: ["boundary-1"],
        events: [],
        sessions: [],
      },
    });
  });

  it("persists acknowledgements when saving a day plan", async () => {
    authMock.getServerSession.mockResolvedValue({ user: { id: "user-1" } });
    prismaMock.utilitySubjectState.findUnique.mockResolvedValue({ checklist: null });
    prismaMock.utilitySubjectState.upsert.mockResolvedValue({
      updatedAt: new Date("2026-04-05T12:05:00.000Z"),
    });

    const response = await POST(
      new Request("http://localhost/api/calendar-planner", {
        method: "POST",
        body: JSON.stringify({
          store: {
            "2026-04-05": {
              notes: "",
              tasks: [],
              acknowledgements: {
                boundaries: ["boundary-1"],
                events: [],
                sessions: [],
              },
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
          subjectKey: "calendar-planner",
        },
      },
      create: {
        userId: "user-1",
        subjectKey: "calendar-planner",
        checklist: {
          "2026-04-05": {
            notes: "",
            tasks: [],
            thoughtDownload: "",
            thoughtOrganization: undefined,
            interstitialJournalEntries: [],
            acknowledgements: {
              boundaries: ["boundary-1"],
              events: [],
              sessions: [],
            },
          },
        },
        links: [],
      },
      update: {
        checklist: {
          "2026-04-05": {
            notes: "",
            tasks: [],
            thoughtDownload: "",
            thoughtOrganization: undefined,
            interstitialJournalEntries: [],
            acknowledgements: {
              boundaries: ["boundary-1"],
              events: [],
              sessions: [],
            },
          },
        },
      },
      select: {
        updatedAt: true,
      },
    });
  });
});
