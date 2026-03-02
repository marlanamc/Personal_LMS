import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error";

const VALID_SUBJECTS = new Set(["health", "job-search"] as const);

type UtilityChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

type UtilityLinkItem = {
  id: string;
  label: string;
  href: string;
};

const isChecklistItem = (value: unknown): value is UtilityChecklistItem => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.text === "string" &&
    typeof item.done === "boolean"
  );
};

const isLinkItem = (value: unknown): value is UtilityLinkItem => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.href === "string"
  );
};

const isChecklist = (value: unknown): value is UtilityChecklistItem[] =>
  Array.isArray(value) && value.every(isChecklistItem);

const isLinks = (value: unknown): value is UtilityLinkItem[] =>
  Array.isArray(value) && value.every(isLinkItem);

const isValidSubject = (
  value: string,
): value is "health" | "job-search" => VALID_SUBJECTS.has(value as "health" | "job-search");

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ subjectKey: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectKey } = await params;
    if (!isValidSubject(subjectKey)) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
    }

    const state = await prisma.utilitySubjectState.findUnique({
      where: {
        userId_subjectKey: {
          userId: session.user.id,
          subjectKey,
        },
      },
      select: {
        checklist: true,
        links: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      checklist: state?.checklist ?? null,
      links: state?.links ?? null,
      updatedAt: state?.updatedAt ?? null,
    });
  } catch (error) {
    return handleApiError(error, "api/utility-subjects/[subjectKey]:GET");
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ subjectKey: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectKey } = await params;
    if (!isValidSubject(subjectKey)) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
    }

    const body = await req.json();
    const checklist = (body as { checklist?: unknown })?.checklist;
    const links = (body as { links?: unknown })?.links;

    if (!isChecklist(checklist) || !isLinks(links)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (checklist.length > 25 || links.length > 25) {
      return NextResponse.json({ error: "Too many items" }, { status: 400 });
    }

    const state = await prisma.utilitySubjectState.upsert({
      where: {
        userId_subjectKey: {
          userId: session.user.id,
          subjectKey,
        },
      },
      create: {
        userId: session.user.id,
        subjectKey,
        checklist,
        links,
      },
      update: {
        checklist,
        links,
      },
      select: {
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, updatedAt: state.updatedAt });
  } catch (error) {
    return handleApiError(error, "api/utility-subjects/[subjectKey]:POST");
  }
}
