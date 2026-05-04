export type WorkspaceToolType = "thought-download" | "organize" | "moment-log";

export interface RecentCapture {
  type: WorkspaceToolType;
  dateKey?: string;
  projectId?: string;
  workspaceId?: 'personal' | 'work';
  preview: string;
  timestamp: string;
}

export interface WorkspaceContext {
  id: string;
  userId: string;
  lastTool: WorkspaceToolType | null;
  lastEditedAt: Date;
  lastDateKey: string | null;
  lastProjectId: string | null;
  recentCaptures: RecentCapture[];
  createdAt: Date;
}

export interface ResumeContext {
  tool: WorkspaceToolType;
  workspaceId?: 'personal' | 'work';
  label: string;
  preview: string;
  lastEditedAt: Date;
  resumeHref: string;
}
