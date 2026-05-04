import { describe, expect, it } from 'vitest';
import {
  getOrganizerWorkspace,
  resolveOrganizerSubjectKey,
  resolveOrganizerWorkspaceId,
} from '@/lib/organize-workspaces';

describe('organize workspaces', () => {
  it('keeps personal organize on the existing subject key', () => {
    expect(getOrganizerWorkspace('personal').subjectKey).toBe('thought-organizer');
    expect(resolveOrganizerSubjectKey(undefined)).toBe('thought-organizer');
  });

  it('maps work desk to an isolated subject key', () => {
    expect(getOrganizerWorkspace('work').title).toBe('Work Desk');
    expect(resolveOrganizerWorkspaceId('work')).toBe('work');
    expect(resolveOrganizerSubjectKey('work')).toBe('thought-organizer:work');
  });

  it('falls back to personal for unknown workspace values', () => {
    expect(resolveOrganizerWorkspaceId('admin')).toBe('personal');
    expect(resolveOrganizerSubjectKey('admin')).toBe('thought-organizer');
  });
});
