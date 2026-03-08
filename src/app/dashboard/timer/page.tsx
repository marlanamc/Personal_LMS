import Link from 'next/link';
import { ArrowRight, Repeat2 } from 'lucide-react';
import { FocusTimer } from '@/components/dashboard/FocusTimer';

export const metadata = {
    title: 'Focus Timer | Marlie LMS',
    description: 'Stay focused with the study timer.',
};

export default function TimerPage() {
    return (
        <main>
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
                <div className="rounded-3xl border border-border-subtle/50 bg-bg-elevated/70 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Optional Handoff</p>
                        <p className="mt-1 text-sm text-text-secondary">
                            Need to build the day first? Generate alternating blocks in On Again / Off Again, then send any block here.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/time-blocks"
                        className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-semibold text-text transition hover:bg-bg-elevated"
                    >
                        <Repeat2 size={15} />
                        Open On Again / Off Again
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </section>
            <FocusTimer />
        </main>
    );
}
