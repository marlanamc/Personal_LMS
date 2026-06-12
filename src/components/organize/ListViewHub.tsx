'use client';

import { useState, useCallback, useMemo } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Download, Eye, EyeOff, MoreHorizontal, Plus } from 'lucide-react';
import { ImportFromThoughtDownload } from './ImportFromThoughtDownload';
import { FlowToast } from './FlowToast';
import { OrganizeHeaderPortal } from './OrganizeHeaderSlot';
import { showToast } from '@/lib/flow-notifications';
import { addImportMetadata, laneToPriority, type ProjectColor, type ProjectMeta, type ThoughtBullet, type ThoughtLane, type ThoughtOrganization } from '@/lib/thought-organization';
import { nanoid } from 'nanoid';
import { ACTIVE_LANES, completionAwareUpdate, isActiveLane, getActiveBullets } from './list-view-hub/helpers';
import { ListWinsPanel } from './list-view-hub/ListWinsPanel';
import { ListViewMobile } from './list-view-hub/mobile';
import { DesktopLaneColumn } from './list-view-hub/desktop';
import { ProjectInspector, FocusInspector } from './list-view-hub/inspectors';
import { ProjectSidebar } from './list-view-hub/ProjectSidebar';

// ── Main component ───────────────────────────────────────────────────────────
interface ListViewHubProps {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
  showDone: boolean;
  onToggleShowDone: () => void;
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
}

export function ListViewHub({
  organization,
  onUpdateOrganization,
  showDone,
  onToggleShowDone,
  selectedProjectId,
  onSelectProject,
}: ListViewHubProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedBulletId, setSelectedBulletId] = useState<string | null>(null);
  const [inspectorProjectId, setInspectorProjectId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [completedBurstId, setCompletedBurstId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } })
  );

  const handleImport = useCallback(
    (bullets: ThoughtBullet[], sourceDateKey: string) => {
      const newBullets = bullets.map((bullet, index) =>
        addImportMetadata({ ...bullet, id: nanoid(), displayOrder: organization.bullets.length + index }, sourceDateKey)
      );
      onUpdateOrganization({ ...organization, bullets: [...organization.bullets, ...newBullets] });
    },
    [organization, onUpdateOrganization]
  );

  const selectedBullet = useMemo(
    () => organization.bullets.find(b => b.id === selectedBulletId) ?? null,
    [organization.bullets, selectedBulletId]
  );

  const handleBulletUpdate = useCallback(
    (id: string, updates: Partial<ThoughtBullet>) => {
      const current = organization.bullets.find(b => b.id === id);
      if (current && updates.lane === 'done' && current.lane !== 'done') {
        setCompletedBurstId(id);
        showToast(`Done: ${current.text}`, 'success');
        setTimeout(() => setCompletedBurstId((value) => value === id ? null : value), 900);
      }

      onUpdateOrganization({
        ...organization,
        bullets: organization.bullets.map(b =>
          b.id === id ? { ...b, ...completionAwareUpdate(b, updates) } : b
        ),
      });
    },
    [organization, onUpdateOrganization]
  );

  const handleBulletDelete = useCallback(
    (id: string) => {
      onUpdateOrganization({ ...organization, bullets: organization.bullets.filter(b => b.id !== id) });
      if (selectedBulletId === id) setSelectedBulletId(null);
    },
    [organization, onUpdateOrganization, selectedBulletId]
  );

  const activeBullets = useMemo(() => getActiveBullets(organization.bullets), [organization.bullets]);
  const visibleBullets = useMemo(
    () => activeBullets.filter(bullet => selectedProjectId === null || bullet.project === selectedProjectId),
    [activeBullets, selectedProjectId]
  );
  const bulletsByLane = useMemo(
    () => ({
      now: visibleBullets.filter(b => b.lane === 'now'),
      next: visibleBullets.filter(b => b.lane === 'next'),
      later: visibleBullets.filter(b => b.lane === 'later'),
    }),
    [visibleBullets]
  );
  const selectedProject = organization.projects.find(project => project.id === selectedProjectId) ?? null;
  const inspectorProject = organization.projects.find(project => project.id === inspectorProjectId) ?? null;

  const selectSidebarProject = useCallback((projectId: string | null) => {
    onSelectProject(projectId);
    setSelectedBulletId(null);
    setInspectorProjectId(projectId);
  }, [onSelectProject]);

  const selectDesktopBullet = useCallback((bulletId: string) => {
    setInspectorProjectId(null);
    setSelectedBulletId(bulletId);
  }, []);

  const addBulletToLane = useCallback((lane: ThoughtLane) => {
    const project = selectedProject ?? organization.projects[0];
    if (!project) return;
    const nextBullet: ThoughtBullet = {
      id: nanoid(),
      text: 'New bullet',
      lineNumber: 0,
      displayOrder: organization.bullets.length,
      lane,
      priority: laneToPriority(lane),
      project: project.id,
      projectMeta: project,
    };
    onUpdateOrganization({ ...organization, bullets: [nextBullet, ...organization.bullets] });
    setSelectedBulletId(nextBullet.id);
  }, [organization, onUpdateOrganization, selectedProject]);

  const markDone = useCallback((id: string) => {
    handleBulletUpdate(id, { lane: 'done', priority: laneToPriority('done') });
  }, [handleBulletUpdate]);

  const reopenDone = useCallback((id: string) => {
    handleBulletUpdate(id, { lane: 'next', priority: laneToPriority('next') });
  }, [handleBulletUpdate]);

  const moveBulletToLane = useCallback((id: string, lane: ThoughtLane) => {
    const bullet = organization.bullets.find(item => item.id === id);
    if (!bullet) return;
    const project = bullet.project
      ? (bullet.projectMeta ?? organization.projects.find(item => item.id === bullet.project))
      : (selectedProject ?? organization.projects[0]);
    if (!project) return;
    handleBulletUpdate(id, {
      lane,
      priority: laneToPriority(lane),
      project: project.id,
      projectMeta: project,
    });
  }, [handleBulletUpdate, organization.bullets, organization.projects, selectedProject]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveDragId(null);
    const overId = event.over?.id ? String(event.over.id) : '';
    const lane = overId.startsWith('desktop-lane:') ? overId.replace('desktop-lane:', '') : null;
    if (lane && isActiveLane(lane)) {
      moveBulletToLane(String(event.active.id), lane);
    }
  }, [moveBulletToLane]);

  const createProject = useCallback(() => {
    const project: ProjectMeta = {
      id: nanoid(),
      label: 'New Project',
      color: 'lavender',
    };
    onUpdateOrganization({ ...organization, projects: [...organization.projects, project] });
    onSelectProject(project.id);
    setSelectedBulletId(null);
    setInspectorProjectId(project.id);
  }, [organization, onSelectProject, onUpdateOrganization]);

  const handleProjectUpdate = useCallback(
    (projectId: string, patch: { label: string; color: ProjectColor }) => {
      const trimmed = patch.label.trim().slice(0, 50);
      if (!trimmed) return;
      const projectsNext = organization.projects.map(p =>
        p.id === projectId ? { ...p, label: trimmed, color: patch.color } : p
      );
      const updatedMeta = projectsNext.find(p => p.id === projectId);
      if (!updatedMeta) return;
      const bulletsNext = organization.bullets.map(b =>
        b.project === projectId ? { ...b, projectMeta: updatedMeta } : b
      );
      onUpdateOrganization({ ...organization, projects: projectsNext, bullets: bulletsNext });
    },
    [organization, onUpdateOrganization]
  );

  return (
    <div className="organize-list-view-root flex h-full overflow-hidden">
      <FlowToast />

      {/* ── MOBILE: full replacement list view ── */}
      <ListViewMobile
        organization={organization}
        onUpdateOrganization={onUpdateOrganization}
        selectedProjectId={selectedProjectId}
        onSelectProject={onSelectProject}
      />

      {/* ── DESKTOP: sidebar + kanban + inspector ── */}
      <ProjectSidebar
        projects={organization.projects}
        bullets={organization.bullets}
        selectedProjectId={selectedProjectId}
        onSelectProject={selectSidebarProject}
        onCreateProject={createProject}
      />

      <div className="organize-command-main hidden lg:flex flex-1 min-w-0 overflow-hidden flex-col">
        <OrganizeHeaderPortal>
          <details className="organize-clean-overflow">
            <summary className="organize-clean-icon-btn" aria-label="List actions" title="List actions">
              <MoreHorizontal className="h-4 w-4" />
            </summary>
            <div className="organize-clean-overflow-panel">
              <button type="button" onClick={(e) => { onToggleShowDone(); e.currentTarget.closest('details')?.removeAttribute('open'); }} className="organize-clean-overflow-item" aria-pressed={showDone}>
                {showDone ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDone ? 'Hide done' : 'Show done'}
              </button>
              <button type="button" onClick={(e) => { setShowImportModal(true); e.currentTarget.closest('details')?.removeAttribute('open'); }} className="organize-clean-overflow-item">
                <Download className="h-4 w-4" /> Import tasks
              </button>
              <button type="button" onClick={(e) => { createProject(); e.currentTarget.closest('details')?.removeAttribute('open'); }} className="organize-clean-overflow-item">
                <Plus className="h-4 w-4" /> New project
              </button>
            </div>
          </details>
        </OrganizeHeaderPortal>

        <div className="organize-command-board-shell">
          <div className="organize-command-board-header">
            <div>
              <h2>{selectedProject ? selectedProject.label : 'All active bullets'}</h2>
              <p>{visibleBullets.length} across {selectedProject ? '1 project' : `${organization.projects.length} projects`}</p>
            </div>
          </div>

          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="organize-command-columns" data-dragging={activeDragId ? 'true' : 'false'}>
              {ACTIVE_LANES.map(lane => (
                <DesktopLaneColumn
                  key={lane}
                  lane={lane}
                  bullets={bulletsByLane[lane]}
                  projects={organization.projects}
                  selectedBulletId={selectedBulletId}
                  onSelectBullet={selectDesktopBullet}
                  onMarkDone={markDone}
                  onUpdateBullet={handleBulletUpdate}
                  completedBurstId={completedBurstId}
                  onAdd={addBulletToLane}
                />
              ))}
            </div>
          </DndContext>

          <ListWinsPanel
            bullets={organization.bullets}
            projects={organization.projects}
            showDone={showDone}
            onToggleShowDone={onToggleShowDone}
            onReopen={reopenDone}
          />
        </div>
      </div>

      {selectedBullet ? (
        <FocusInspector
          bullet={selectedBullet}
          projects={organization.projects}
          onUpdate={updates => handleBulletUpdate(selectedBullet.id, updates)}
          onUpdateProject={handleProjectUpdate}
          onDelete={() => handleBulletDelete(selectedBullet.id)}
          onClose={() => setSelectedBulletId(null)}
        />
      ) : inspectorProject ? (
        <ProjectInspector
          project={inspectorProject}
          bullets={organization.bullets}
          onUpdateProject={handleProjectUpdate}
          onClose={() => setInspectorProjectId(null)}
        />
      ) : null}

      <ImportFromThoughtDownload
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        existingBullets={organization.bullets}
      />
    </div>
  );
}
