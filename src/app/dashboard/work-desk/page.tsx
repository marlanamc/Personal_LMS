import { OrganizeView } from '@/components/organize/OrganizeView';
import { getOrganizerWorkspace } from '@/lib/organize-workspaces';

const workspace = getOrganizerWorkspace('work');

export const metadata = {
  title: workspace.metadataTitle,
  description: workspace.metadataDescription,
};

export default function WorkDeskPage() {
  return <OrganizeView workspace={workspace} />;
}
