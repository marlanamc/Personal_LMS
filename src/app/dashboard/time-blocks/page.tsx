import { redirect } from 'next/navigation';

export const metadata = {
  title: 'On Again / Off Again | Personal LMS',
  description: 'Alternate the thing you want to do with the thing you should do.',
};

export default function TimeBlocksPage() {
  // Redirect to Day Planner with the On Again/Off Again tool open
  redirect('/dashboard/day-planner?openTool=on-again-off-again');
}
