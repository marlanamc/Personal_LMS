import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTodayChallengeWithProgress } from "@/lib/daily-challenge";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const challenge = await getTodayChallengeWithProgress(userId);

    return NextResponse.json(challenge);
  } catch (error) {
    return handleApiError(error, "api/daily-challenge:GET");
  }
}
