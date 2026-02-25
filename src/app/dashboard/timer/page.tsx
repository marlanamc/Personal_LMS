import { FocusTimer } from '@/components/dashboard/FocusTimer';

export const metadata = {
    title: 'Focus Timer | Marlie LMS',
    description: 'Stay focused with the study timer.',
};

export default function TimerPage() {
    return (
        <main>
            <FocusTimer />
        </main>
    );
}
