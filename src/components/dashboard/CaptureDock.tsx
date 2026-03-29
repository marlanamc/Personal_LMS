'use client';

import Link from 'next/link';
import {
  BookOpenText,
  HeartPulse,
  Plus,
  Timer,
} from 'lucide-react';

interface CaptureDockProps {
  // Props kept for future use, but not currently used in simplified button view
}

export function CaptureDock({}: CaptureDockProps) {

  return (
    <>
      {/* Quick access navigation buttons - visible on all screens */}
      <div className="rounded-[1.6rem] border border-border-subtle/50 bg-bg-surface/60 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden p-4 md:p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/thought"
            className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 text-text active:bg-primary/10 active:border-primary/40 active:text-primary md:hover:bg-primary/10 md:hover:border-primary/40 md:hover:text-primary transition-all duration-200 group"
          >
            <BookOpenText className="h-5 w-5 transition-transform group-active:scale-110 md:group-hover:scale-110" />
            <span className="text-sm font-medium">Thought</span>
          </Link>

          <Link
            href="/task"
            className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 text-text active:bg-accent-teal/10 active:border-accent-teal/40 active:text-accent-teal md:hover:bg-accent-teal/10 md:hover:border-accent-teal/40 md:hover:text-accent-teal transition-all duration-200 group"
          >
            <Plus className="h-5 w-5 transition-transform group-active:scale-110 md:group-hover:scale-110" />
            <span className="text-sm font-medium">Task</span>
          </Link>

          <Link
            href="/moment"
            className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 text-text active:bg-accent-teal/10 active:border-accent-teal/40 active:text-accent-teal md:hover:bg-accent-teal/10 md:hover:border-accent-teal/40 md:hover:text-accent-teal transition-all duration-200 group"
          >
            <Timer className="h-5 w-5 transition-transform group-active:scale-110 md:group-hover:scale-110" />
            <span className="text-sm font-medium">Moment</span>
          </Link>

          <Link
            href="/health"
            className="flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border border-border-subtle/50 bg-bg-elevated/40 text-text active:bg-accent-mint/10 active:border-accent-mint/40 active:text-accent-mint md:hover:bg-accent-mint/10 md:hover:border-accent-mint/40 md:hover:text-accent-mint transition-all duration-200 group"
          >
            <HeartPulse className="h-5 w-5 transition-transform group-active:scale-110 md:group-hover:scale-110" />
            <span className="text-sm font-medium">Health</span>
          </Link>
        </div>
      </div>
    </>
  );
}
