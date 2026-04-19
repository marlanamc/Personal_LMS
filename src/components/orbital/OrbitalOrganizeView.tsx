'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { nanoid } from 'nanoid';
import type { ThoughtOrganization, ThoughtBullet } from '@/lib/thought-organization';
import { laneToPriority } from '@/lib/thought-organization';
import { useOrbitalLayout } from './hooks/useOrbitalLayout';
import { parseDropZoneId, orbitalCollisionDetection, type DragData } from './hooks/useOrbitalDrag';
import { ProjectOrbit } from './ProjectOrbit';
import { ProjectCenter } from './ProjectCenter';
import { OrbitalInbox } from './OrbitalInbox';
import { OrbitalDetailPanel } from './OrbitalDetailPanel';
import { CentralSun } from './CentralSun';

type OrbitalOrganizeViewProps = {
  organization: ThoughtOrganization;
  onUpdateOrganization: (org: ThoughtOrganization) => void;
};

export function OrbitalOrganizeView({
  organization,
  onUpdateOrganization,
}: OrbitalOrganizeViewProps) {
  const [selectedBulletId, setSelectedBulletId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const layout = useOrbitalLayout(organization);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedBullet = selectedBulletId
    ? organization.bullets.find((b) => b.id === selectedBulletId) || null
    : null;

  // ── DnD ──
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      const { active, over } = event;
      if (!over) return;
      
      const dragData = active.data.current as DragData;
      const dropZone = parseDropZoneId(String(over.id));
      if (!dragData || !dropZone || dragData.type !== 'task') return;
      
      const bulletId = dragData.bulletId;
      const bullet = organization.bullets.find((b) => b.id === bulletId);
      if (!bullet) return;

      let updates: Partial<ThoughtBullet> = {};
      
      if (dropZone.type === 'inbox') {
        updates = { project: undefined, projectMeta: undefined };
      } else if (dropZone.type === 'orbit' || dropZone.type === 'project-center') {
        const targetProject = organization.projects.find((p) => p.id === dropZone.projectId);
        if (targetProject) {
          updates = { project: targetProject.id, projectMeta: targetProject };
        }
        if (dropZone.lane) {
          updates.lane = dropZone.lane;
          updates.priority = laneToPriority(dropZone.lane);
        }
      }
      
      if (Object.keys(updates).length > 0) {
        onUpdateOrganization({
          ...organization,
          bullets: organization.bullets.map((b) =>
            b.id === bulletId ? { ...b, ...updates } : b
          ),
        });
      }
    },
    [organization, onUpdateOrganization]
  );

  const handleSelectBullet = useCallback((bullet: ThoughtBullet) => {
    setSelectedBulletId(bullet.id);
  }, []);
  const handleCloseDetail = useCallback(() => setSelectedBulletId(null), []);
  const handleUpdateBullet = useCallback(
    (bulletId: string, updates: Partial<ThoughtBullet>) => {
      onUpdateOrganization({
        ...organization,
        bullets: organization.bullets.map((b) => (b.id === bulletId ? { ...b, ...updates } : b)),
      });
    },
    [organization, onUpdateOrganization]
  );
  const handleDeleteBullet = useCallback(
    (bulletId: string) => {
      onUpdateOrganization({
        ...organization,
        bullets: organization.bullets.filter((b) => b.id !== bulletId),
      });
    },
    [organization, onUpdateOrganization]
  );
  const handleAddInboxBullet = useCallback(
    (text: string) => {
      const newBullet: ThoughtBullet = {
        id: nanoid(),
        text,
        lineNumber: 0,
        displayOrder: organization.bullets.length,
      };
      onUpdateOrganization({
        ...organization,
        bullets: [...organization.bullets, newBullet],
      });
    },
    [organization, onUpdateOrganization]
  );

  // Carousel navigation
  const handlePrevPlanet = useCallback(() => {
    setCarouselIndex((prev) => (prev === 0 ? layout.projects.length - 1 : prev - 1));
  }, [layout.projects.length]);

  const handleNextPlanet = useCallback(() => {
    setCarouselIndex((prev) => (prev === layout.projects.length - 1 ? 0 : prev + 1));
  }, [layout.projects.length]);

  const handleExpandPlanet = useCallback((projectId: string) => {
    setExpandedProjectId(projectId);
  }, []);

  const handleCollapsePlanet = useCallback(() => {
    setExpandedProjectId(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedProjectId) {
        if (e.key === 'Escape') {
          handleCollapsePlanet();
        }
      } else {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevPlanet();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextPlanet();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const currentProject = layout.projects[carouselIndex];
          if (currentProject) {
            handleExpandPlanet(currentProject.projectId);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedProjectId, carouselIndex, layout.projects, handlePrevPlanet, handleNextPlanet, handleExpandPlanet, handleCollapsePlanet]);

  const currentProject = layout.projects[carouselIndex];
  const expandedProject = expandedProjectId
    ? layout.projects.find(p => p.projectId === expandedProjectId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={orbitalCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="celestial-carousel-view w-full h-full flex flex-col items-center justify-center overflow-hidden relative"
        ref={containerRef}
        style={{
          background: 'radial-gradient(ellipse at center, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)',
        }}
      >
        {layout.projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16">
            <p className="text-lg font-medium text-[var(--color-text-muted)]">
              No projects yet — create one to start organizing
            </p>
          </div>
        ) : expandedProject ? (
          /* Expanded planet view - full screen with moons */
          <div className="expanded-planet-view w-full h-full flex items-center justify-center relative">
            <button
              onClick={handleCollapsePlanet}
              className="absolute top-6 left-6 z-50 px-4 py-2 rounded-lg bg-bg-elevated text-text-muted hover:text-text transition-colors flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Carousel
            </button>

            <svg
              width="100%"
              height="100%"
              viewBox="-400 -400 800 800"
              className="expanded-planet-canvas"
            >
              {/* Planet with moons */}
              <ProjectOrbit
                data={expandedProject}
                selectedBulletId={selectedBulletId}
                onSelectBullet={handleSelectBullet}
              />
            </svg>
          </div>
        ) : (
          /* Carousel view - planets in a row */
          <div className="carousel-container w-full h-full flex flex-col items-center justify-center gap-8 relative">
            {/* Carousel planets */}
            <div className="carousel-planets-wrapper relative flex items-center justify-center">
              <div
                className="carousel-track flex items-center gap-8 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${-carouselIndex * 420}px)`,
                }}
              >
                {layout.projects.map((projectData, index) => {
                  const isCurrent = index === carouselIndex;
                  const distance = Math.abs(index - carouselIndex);
                  const opacity = isCurrent ? 1 : Math.max(0.3, 1 - distance * 0.3);
                  const scale = isCurrent ? 1 : Math.max(0.6, 1 - distance * 0.2);

                  return (
                    <div
                      key={projectData.projectId}
                      className="carousel-planet-card"
                      style={{
                        opacity,
                        transform: `scale(${scale})`,
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: isCurrent ? 'pointer' : 'default',
                        pointerEvents: isCurrent ? 'auto' : 'none',
                      }}
                      onClick={() => isCurrent && handleExpandPlanet(projectData.projectId)}
                    >
                      <svg
                        width="380"
                        height="380"
                        viewBox="-190 -190 380 380"
                        className="planet-preview"
                      >
                        {/* Just the planet, no moons in carousel */}
                        <ProjectCenter
                          project={projectData.projectMeta}
                          totalCount={projectData.totalCount}
                          nowCount={projectData.nowCount}
                          planetSize={100}
                        />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={handlePrevPlanet}
              className="carousel-nav-btn carousel-nav-btn--prev absolute left-8 top-1/2 -translate-y-1/2 z-10"
              aria-label="Previous planet"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={handleNextPlanet}
              className="carousel-nav-btn carousel-nav-btn--next absolute right-8 top-1/2 -translate-y-1/2 z-10"
              aria-label="Next planet"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Project info below */}
            {currentProject && (
              <div className="carousel-info text-center max-w-md">
                <h2 className="text-2xl font-display font-bold text-text mb-2">
                  {currentProject.projectMeta.label}
                </h2>
                <p className="text-sm text-text-muted mb-4">
                  {currentProject.totalCount} task{currentProject.totalCount !== 1 ? 's' : ''}
                  {currentProject.nowCount > 0 && (
                    <span className="ml-2 text-primary font-semibold">
                      • {currentProject.nowCount} active
                    </span>
                  )}
                </p>
                <button
                  onClick={() => handleExpandPlanet(currentProject.projectId)}
                  className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
                >
                  View Tasks
                </button>
              </div>
            )}

            {/* Carousel dots */}
            <div className="carousel-dots flex items-center gap-2">
              {layout.projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`carousel-dot ${index === carouselIndex ? 'carousel-dot--active' : ''}`}
                  aria-label={`Go to planet ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Floating inbox */}
        <div className="constellation-inbox fixed bottom-6 left-6 z-30">
          <OrbitalInbox
            bullets={layout.inbox}
            selectedBulletId={selectedBulletId}
            onSelectBullet={handleSelectBullet}
            onAddBullet={handleAddInboxBullet}
          />
        </div>

        {/* Active count */}
        {layout.totalNowCount > 0 && (
          <div className="constellation-now-badge">
            <span className="constellation-now-badge__count">{layout.totalNowCount}</span>
            <span className="constellation-now-badge__label">active</span>
          </div>
        )}

        {/* Detail panel */}
        <OrbitalDetailPanel
          bullet={selectedBullet}
          projects={organization.projects}
          onUpdate={handleUpdateBullet}
          onDelete={handleDeleteBullet}
          onClose={handleCloseDetail}
        />
      </div>
    </DndContext>
  );
}
