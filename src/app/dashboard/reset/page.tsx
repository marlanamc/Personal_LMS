import { GetUnstuckPage } from '@/components/dashboard/GetUnstuckPage';

export const metadata = {
  title: 'Get Unstuck | Marlie LMS',
  description: 'A calm reset flow for freeze, hard transitions, and overwhelm.',
};

export default function ResetPage() {
  return (
    <main className="px-3 pb-24 pt-3 sm:px-6 md:pt-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <GetUnstuckPage />
      </div>
    </main>
  );
}
