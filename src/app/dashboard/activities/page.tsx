import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ category?: string; subject?: string }> };

export default async function ActivitiesPageRedirect({ searchParams }: Props) {
    const { category, subject } = await searchParams;
    const params = new URLSearchParams();
    const validSubjects = new Set(["spanish", "coding", "health", "job-search"]);

    if (subject && validSubjects.has(subject)) {
        params.set("subject", subject);
    } else if (category && validSubjects.has(category)) {
        params.set("subject", category);
    }

    const query = params.toString();
    redirect(query ? `/dashboard/subjects?${query}` : "/dashboard/subjects");
}
