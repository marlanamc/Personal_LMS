export type OrganizerWorkspaceId = 'personal' | 'work';

export type OrganizerWorkspaceConfig = {
  id: OrganizerWorkspaceId;
  subjectKey: string;
  title: string;
  metadataTitle: string;
  metadataDescription: string;
  viewStorageKey: string;
  loadingLabel: string;
  itemSingular: string;
  itemPlural: string;
  inboxTitle: string;
  inboxAriaLabel: string;
  inboxToggleTitle: string;
  inboxEmptyLabel: string;
  inboxPlaceholder: string;
  closeInboxLabel: string;
};

export const ORGANIZER_WORKSPACES: Record<OrganizerWorkspaceId, OrganizerWorkspaceConfig> = {
  personal: {
    id: 'personal',
    subjectKey: 'thought-organizer',
    title: 'Organize',
    metadataTitle: 'Organize | Personal LMS',
    metadataDescription: 'Cross-day project workspace for organizing thoughts and tasks',
    viewStorageKey: 'organize-view-mode',
    loadingLabel: 'Loading organize workspace...',
    itemSingular: 'bullet',
    itemPlural: 'bullets',
    inboxTitle: 'Inbox',
    inboxAriaLabel: 'Inbox panel',
    inboxToggleTitle: 'Task tray',
    inboxEmptyLabel: 'Inbox is empty',
    inboxPlaceholder: 'Add bullet to Inbox',
    closeInboxLabel: 'Close inbox panel',
  },
  work: {
    id: 'work',
    subjectKey: 'thought-organizer:work',
    title: 'Work Desk',
    metadataTitle: 'Work Desk | Personal LMS',
    metadataDescription: 'Work-only project workspace for job, admin, and development tasks',
    viewStorageKey: 'work-desk-view-mode',
    loadingLabel: 'Loading work desk...',
    itemSingular: 'work item',
    itemPlural: 'work items',
    inboxTitle: 'Work Inbox',
    inboxAriaLabel: 'Work inbox panel',
    inboxToggleTitle: 'Work inbox',
    inboxEmptyLabel: 'Work inbox is empty',
    inboxPlaceholder: 'Add work item to Work Inbox',
    closeInboxLabel: 'Close work inbox panel',
  },
};

export function getOrganizerWorkspace(id: OrganizerWorkspaceId = 'personal'): OrganizerWorkspaceConfig {
  return ORGANIZER_WORKSPACES[id];
}

export function resolveOrganizerWorkspaceId(value: unknown): OrganizerWorkspaceId {
  return value === 'work' ? 'work' : 'personal';
}

export function resolveOrganizerSubjectKey(value: unknown): string {
  return getOrganizerWorkspace(resolveOrganizerWorkspaceId(value)).subjectKey;
}
