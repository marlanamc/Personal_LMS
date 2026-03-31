'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, FolderKanban, LayoutGrid, Plus } from 'lucide-react';
import { useProjectPlanner } from './useProjectPlanner';
import { useDailyAnchors } from '@/components/daily-anchors/useDailyAnchors';
import { ProjectCard, EmptyProjectCard } from './ProjectCard';
import { AddProjectSheet, type ProjectAnchorConfig, type ProjectCalendarEventConfig } from './AddProjectSheet';
import { ProjectDetailSheet } from './ProjectDetailSheet';
import { ProjectMonthCalendar } from './ProjectMonthCalendar';
import { ProjectTimelineSummary } from './ProjectTimelineStrip';
import type { DateKey, Project } from '@/lib/project-planner';
import {
  buildUniformWeeklySchedule,
  sanitizeAnchorId,
  type DailyAnchorTemplate,
} from '@/lib/anchors';

type ViewTab = 'overview' | 'calendar';

interface ProjectPlannerViewProps {
  storageScope: string;
  /** Class used when creating optional calendar events (same feed as Plan → calendar / upcoming). */
  calendarClassId?: string | null;
}

export function ProjectPlannerView({ storageScope, calendarClassId = null }: ProjectPlannerViewProps) {
  const {
    store,
    isLoaded,
    isSaving,
    activeProjects,
    archivedProjects,
    createProject,
    archiveProject,
    deleteProject,
    addTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    moveTaskToDate,
    autoDistribute,
  } = useProjectPlanner(storageScope);

  // Daily anchors hook for creating project anchors
  const { anchorTemplates, setAnchorTemplates, isLoaded: anchorsLoaded } = useDailyAnchors(storageScope);

  const [viewTab, setViewTab] = useState<ViewTab>('overview');
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? store.projects.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const handleCreateProject = useCallback(
    async (data: {
      name: string;
      startDate: DateKey;
      endDate: DateKey;
      emoji?: string;
      description?: string;
      tasks?: import('@/lib/project-planner').ProjectTask[];
      categories?: string[];
      anchorConfig?: ProjectAnchorConfig;
      calendarEventConfig?: ProjectCalendarEventConfig;
    }) => {
      const project = createProject(data.name, data.startDate, data.endDate, {
        emoji: data.emoji,
        description: data.description,
        tasks: data.tasks,
        categories: data.categories,
      });

      // Create a daily anchor if requested
      if (data.anchorConfig?.enabled && anchorsLoaded) {
        const anchorId = sanitizeAnchorId(`project-${project.id}`);
        const newAnchor: DailyAnchorTemplate = {
          id: anchorId,
          label: data.emoji ? `${data.emoji} ${data.name}` : data.name,
          icon: 'target',
          color: 'mint',
          importanceNote: data.description || `Daily anchor for "${data.name}" project`,
          weeklySchedule: buildUniformWeeklySchedule(data.anchorConfig.scheduledTime),
          activeFrom: data.startDate,
          activeUntil: data.endDate,
          linkedProjectId: project.id,
        };

        // Add to existing templates
        setAnchorTemplates([...anchorTemplates, newAnchor]);
      }

      if (data.calendarEventConfig?.enabled && calendarClassId) {
        const title = data.emoji ? `${data.emoji} ${data.name}`.trim() : data.name;
        const descParts = [data.description?.trim(), 'Created from Projects.'].filter(Boolean);
        try {
          const res = await fetch('/api/calendar-events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              classId: calendarClassId,
              title,
              date: data.startDate,
              endDate: data.endDate,
              type: 'event',
              description: descParts.length > 0 ? descParts.join('\n\n') : undefined,
            }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('[ProjectPlanner] Calendar event create failed', err);
          }
        } catch (e) {
          console.error('[ProjectPlanner] Calendar event create failed', e);
        }
      }

      // Open the newly created project
      setSelectedProjectId(project.id);
    },
    [createProject, anchorTemplates, setAnchorTemplates, anchorsLoaded, calendarClassId],
  );

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProjectId(project.id);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedProjectId(null);
  }, []);

  const handleArchive = useCallback(
    (projectId: string) => {
      archiveProject(projectId);
      setSelectedProjectId(null);
    },
    [archiveProject],
  );

  const handleDelete = useCallback(
    (projectId: string) => {
      deleteProject(projectId);
      setSelectedProjectId(null);
    },
    [deleteProject],
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[var(--primary)]" />
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">
              Projects
            </h1>
            {isSaving && (
              <span className="text-xs text-[var(--text-muted)]">Saving...</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowAddSheet(true)}
            className={`
              flex items-center gap-1.5 px-3 py-2 rounded-xl
              bg-[var(--color-primary)] text-white text-sm font-medium
              hover:opacity-90
              transition-colors
              shadow-md shadow-[color-mix(in_srgb,var(--color-primary)_28%,transparent)]
            `}
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>

        {/* View Tabs */}
        {activeProjects.length > 0 && (
          <div className="flex gap-1 p-1 bg-[var(--color-bg-surface)] rounded-xl">
            <TabButton
              isActive={viewTab === 'overview'}
              onClick={() => setViewTab('overview')}
              icon={<LayoutGrid className="w-4 h-4" />}
              label="Overview"
            />
            <TabButton
              isActive={viewTab === 'calendar'}
              onClick={() => setViewTab('calendar')}
              icon={<CalendarDays className="w-4 h-4" />}
              label="Calendar"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <AnimatePresence mode="wait">
          {viewTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {activeProjects.length === 0 ? (
                <div className="py-8">
                  <EmptyProjectCard onCreate={() => setShowAddSheet(true)} />

                  {/* Benefits */}
                  <div className="mt-8 space-y-4">
                    <h2 className="text-sm font-medium text-[var(--text-secondary)] text-center">
                      Break down big goals into daily wins
                    </h2>
                    <div className="grid gap-3">
                      <FeatureCard
                        emoji="🧹"
                        title="Apartment Deep Clean"
                        description="2 weeks of 15-minute tasks"
                      />
                      <FeatureCard
                        emoji="📚"
                        title="Learn a New Skill"
                        description="Daily practice sessions"
                      />
                      <FeatureCard
                        emoji="🏃"
                        title="Fitness Challenge"
                        description="Progressive workouts"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={() => handleSelectProject(project)}
                    />
                  ))}

                  {/* Archived section */}
                  {archivedProjects.length > 0 && (
                    <div className="pt-6">
                      <h3 className="text-sm text-[var(--text-muted)] mb-3">
                        Archived ({archivedProjects.length})
                      </h3>
                      <div className="space-y-2 opacity-60">
                        {archivedProjects.slice(0, 3).map((project) => (
                          <div
                            key={project.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-surface)]"
                          >
                            <span className="text-lg">{project.emoji || '📋'}</span>
                            <span className="text-sm text-[var(--text-secondary)]">
                              {project.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  {/* Project Header */}
                  <button
                    onClick={() => handleSelectProject(project)}
                    className="flex items-center gap-2 text-left group"
                  >
                    <span className="text-xl">{project.emoji || '📋'}</span>
                    <span className="font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                      {project.name}
                    </span>
                  </button>

                  <div className="overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
                    <ProjectMonthCalendar
                      project={project}
                      onSelectDate={() => handleSelectProject(project)}
                    />
                  </div>

                  <ProjectTimelineSummary project={project} />
                </div>
              ))}

              {activeProjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[var(--text-muted)]">No active projects</p>
                  <button
                    onClick={() => setShowAddSheet(true)}
                    className="mt-4 text-[var(--primary)] text-sm font-medium"
                  >
                    Create your first project
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Project Sheet */}
      <AddProjectSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onSubmit={handleCreateProject}
        recentEmojis={store.recentEmojis}
        calendarClassId={calendarClassId}
      />

      {/* Project Detail Sheet */}
      <ProjectDetailSheet
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseDetail}
        onAddTask={addTask}
        onToggleTask={toggleTaskComplete}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
        onMoveTask={moveTaskToDate}
        onAutoDistribute={autoDistribute}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </div>
  );
}

// Tab button component
function TabButton({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`
        flex-1 flex items-center justify-center gap-1.5
        py-2 px-3 rounded-lg
        text-sm font-semibold
        transition-all duration-200
        ${
          isActive
            ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[color-mix(in_srgb,var(--color-primary)_30%,transparent)] ring-2 ring-[color-mix(in_srgb,var(--color-primary)_65%,transparent)] ring-offset-2 ring-offset-[color-mix(in_srgb,var(--color-bg-surface)_100%,transparent)]'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)] border-2 border-transparent'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// Feature card for empty state
function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`
        flex items-center gap-3 p-3
        bg-[var(--color-bg-surface)]
        border border-[var(--color-border-subtle)] rounded-xl
      `}
    >
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      </div>
    </div>
  );
}
