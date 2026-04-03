'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  laneToPriority,
  type ThoughtBullet,
  type ThoughtLane,
  type ProjectMeta,
  type ProjectColor,
} from '@/lib/thought-organization';

interface BulletInlineEditorProps {
  bullet: ThoughtBullet;
  existingProjects: ProjectMeta[];
  onUpdate: (updates: Partial<ThoughtBullet>) => void;
  onClose: () => void;
}

const LANE_BUTTONS = [
  { value: 'now' as ThoughtLane, label: 'Now', color: 'bg-primary text-white hover:bg-primary/90' },
  { value: 'next' as ThoughtLane, label: 'Next', color: 'bg-accent-teal text-white hover:bg-accent-teal/90' },
  { value: 'later' as ThoughtLane, label: 'Later', color: 'bg-accent-mint text-white hover:bg-accent-mint/90' },
  { value: 'done' as ThoughtLane, label: 'Done', color: 'bg-emerald-600 text-white hover:bg-emerald-700' },
];

const COLOR_OPTIONS: ProjectColor[] = ['peach', 'coral', 'sky', 'mint', 'sage', 'periwinkle', 'lavender', 'blush', 'rose', 'slate'];

const COLOR_HEX: Record<ProjectColor, string> = {
  peach: '#e0b89a',
  sky: '#9dc5e8',
  mint: '#7dbba3',
  periwinkle: '#9ba3d4',
  lavender: '#b8a5c8',
  rose: '#c9a0ab',
  coral: '#e8b4a8',
  sage: '#8bc4b8',
  blush: '#d4b8c4',
  slate: '#a4b0c4',
};

export function BulletInlineEditor({
  bullet,
  existingProjects,
  onUpdate,
  onClose,
}: BulletInlineEditorProps) {
  const [lane, setLane] = useState<ThoughtLane | undefined>(bullet.lane);
  const [projectLabel, setProjectLabel] = useState(bullet.projectMeta?.label || '');
  const [projectColor, setProjectColor] = useState<ProjectColor>(bullet.projectMeta?.color || 'lavender');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = existingProjects.filter(p =>
    p.label.toLowerCase().includes(projectLabel.toLowerCase())
  );

  const handleLaneClick = (newLane: ThoughtLane) => {
    const updatedLane = lane === newLane ? undefined : newLane;
    setLane(updatedLane);
    onUpdate({
      lane: updatedLane,
      priority: laneToPriority(updatedLane),
    });
  };

  const handleProjectChange = (value: string) => {
    setProjectLabel(value);
    setShowSuggestions(value.length > 0 && filteredProjects.length > 0);
  };

  const handleProjectSelect = (selectedProject: ProjectMeta) => {
    setProjectLabel(selectedProject.label);
    setProjectColor(selectedProject.color);
    setShowSuggestions(false);
    onUpdate({
      project: selectedProject.id,
      projectMeta: selectedProject,
    });
  };

  const handleProjectBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
      const trimmed = projectLabel.trim();
      if (trimmed && trimmed !== bullet.projectMeta?.label) {
        const projectId = crypto.randomUUID();
        const projectMeta: ProjectMeta = {
          id: projectId,
          label: trimmed,
          color: projectColor,
        };
        onUpdate({
          project: projectId,
          projectMeta,
        });
      } else if (!trimmed) {
        onUpdate({ project: undefined, projectMeta: undefined });
      }
    }, 150);
  };

  const handleClear = () => {
    setLane(undefined);
    setProjectLabel('');
    setProjectColor('lavender');
    onUpdate({ lane: undefined, priority: undefined, project: undefined, projectMeta: undefined });
  };

  const handleDone = () => {
    const trimmed = projectLabel.trim();
    if (trimmed && trimmed !== bullet.projectMeta?.label) {
      const projectId = bullet.projectMeta?.id || crypto.randomUUID();
      const projectMeta: ProjectMeta = {
        id: projectId,
        label: trimmed,
        color: projectColor,
      };
      onUpdate({
        project: projectId,
        projectMeta,
      });
    } else if (!trimmed && bullet.projectMeta) {
      onUpdate({ project: undefined, projectMeta: undefined });
    }
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleDone();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [projectLabel, projectColor]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="overflow-hidden rounded-xl border border-border-subtle/60 bg-bg-elevated/95 p-4 sm:p-5"
      style={{
        boxShadow: 'var(--shadow-organize-card-hover)',
        backdropFilter: 'blur(var(--blur-glass-md))',
        WebkitBackdropFilter: 'blur(var(--blur-glass-md))',
      }}
    >
      <div className="space-y-3 sm:space-y-4">
        {/* Lane Buttons */}
        <div>
          <label className="mb-2.5 block text-xs font-semibold text-text-muted uppercase tracking-wide">Placement</label>
          <div className="flex gap-2">
            {LANE_BUTTONS.map(btn => (
              <button
                key={btn.value}
                onClick={() => handleLaneClick(btn.value)}
                className={`flex-1 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                  lane === btn.value
                    ? `${btn.color} shadow-lg scale-105`
                    : 'border border-border-subtle/80 bg-bg-surface/80 text-text-muted hover:bg-bg-elevated hover:border-border-subtle hover:scale-102'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Input */}
        <div className="relative">
          <label className="mb-2.5 block text-xs font-semibold text-text-muted uppercase tracking-wide">Project</label>
          <input
            ref={inputRef}
            type="text"
            value={projectLabel}
            onChange={(e) => handleProjectChange(e.target.value)}
            onFocus={() => {
              if (projectLabel && filteredProjects.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={handleProjectBlur}
            placeholder="Type project name"
            className="w-full rounded-xl border border-border-subtle/80 bg-bg-surface/80 px-4 py-2.5 text-xs sm:text-sm text-text placeholder:text-text-muted/50 transition-all focus:border-primary focus:bg-bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          {/* Autocomplete Suggestions */}
          {showSuggestions && filteredProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full z-10 mt-2 max-h-40 overflow-y-auto rounded-xl border border-border-subtle/60 bg-bg-elevated/95"
              style={{
                boxShadow: 'var(--shadow-organize-card-hover)',
                backdropFilter: 'blur(var(--blur-glass-md))',
                WebkitBackdropFilter: 'blur(var(--blur-glass-md))',
              }}
            >
              {filteredProjects.map((proj) => (
                <button
                  key={proj.id}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur
                    handleProjectSelect(proj);
                  }}
                  className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-bg-surface/60 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className={`moment-tag-pill moment-tag-pill-selected-${proj.color} transition-transform hover:scale-105`}>
                    {proj.label}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Color Picker */}
        <div>
          <label className="mb-2.5 block text-xs font-semibold text-text-muted uppercase tracking-wide">Tag color</label>
          <div className="flex flex-wrap justify-center gap-2.5">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setProjectColor(color)}
                className={`h-8 w-8 shrink-0 rounded-full transition-all duration-200 hover:scale-110 ${
                  projectColor === color ? 'scale-125 ring-2 ring-primary/60 ring-offset-2 ring-offset-bg-elevated shadow-lg' : 'shadow-md hover:shadow-lg'
                }`}
                style={{ backgroundColor: COLOR_HEX[color] }}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleClear}
            className="text-xs font-semibold text-text-muted hover:text-text transition-all hover:scale-105 touch-manipulation min-h-[44px] sm:min-h-0"
          >
            Clear
          </button>
          <button
            onClick={handleDone}
            className="rounded-xl bg-primary px-5 sm:px-6 py-2.5 sm:py-2 text-xs sm:text-sm font-bold text-white hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl touch-manipulation min-h-[44px] sm:min-h-0"
          >
            Done
          </button>
        </div>
      </div>
    </motion.div>
  );
}
