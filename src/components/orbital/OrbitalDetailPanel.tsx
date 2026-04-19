'use client';

import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Check } from 'lucide-react';
import {
  laneToPriority,
  type ThoughtBullet,
  type ThoughtLane,
  type ProjectMeta,
  type ProjectColor,
} from '@/lib/thought-organization';

const LANE_OPTIONS: { value: ThoughtLane; label: string; color: string }[] = [
  { value: 'now', label: 'Now', color: 'bg-primary' },
  { value: 'next', label: 'Next', color: 'bg-accent-teal' },
  { value: 'later', label: 'Later', color: 'bg-accent-mint' },
  { value: 'done', label: 'Done', color: 'bg-emerald-600' },
];

const COLOR_OPTIONS: ProjectColor[] = [
  'peach', 'coral', 'sky', 'mint', 'sage', 'periwinkle', 'lavender', 'blush', 'rose', 'slate'
];

type OrbitalDetailPanelProps = {
  bullet: ThoughtBullet | null;
  projects: ProjectMeta[];
  onUpdate: (bulletId: string, updates: Partial<ThoughtBullet>) => void;
  onDelete: (bulletId: string) => void;
  onClose: () => void;
};

export const OrbitalDetailPanel = memo(function OrbitalDetailPanel({
  bullet,
  projects,
  onUpdate,
  onDelete,
  onClose,
}: OrbitalDetailPanelProps) {
  const [text, setText] = useState('');
  const [lane, setLane] = useState<ThoughtLane | undefined>();
  const [projectId, setProjectId] = useState<string | undefined>();
  const [projectLabel, setProjectLabel] = useState('');
  const [projectColor, setProjectColor] = useState<ProjectColor>('lavender');
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state when bullet changes
  useEffect(() => {
    if (bullet) {
      setText(bullet.text);
      setLane(bullet.lane);
      setProjectId(bullet.project);
      setProjectLabel(bullet.projectMeta?.label || '');
      setProjectColor(bullet.projectMeta?.color || 'lavender');
    }
  }, [bullet]);

  const handleTextSave = useCallback(() => {
    if (bullet && text.trim() !== bullet.text) {
      onUpdate(bullet.id, { text: text.trim() });
    }
  }, [bullet, text, onUpdate]);

  const handleLaneChange = useCallback(
    (newLane: ThoughtLane) => {
      if (!bullet) return;
      setLane(newLane);
      onUpdate(bullet.id, {
        lane: newLane,
        priority: laneToPriority(newLane),
      });
    },
    [bullet, onUpdate]
  );

  const handleProjectSelect = useCallback(
    (project: ProjectMeta | null) => {
      if (!bullet) return;
      setShowProjectPicker(false);

      if (project) {
        setProjectId(project.id);
        setProjectLabel(project.label);
        setProjectColor(project.color);
        onUpdate(bullet.id, {
          project: project.id,
          projectMeta: project,
        });
      } else {
        // Unassign
        setProjectId(undefined);
        setProjectLabel('');
        onUpdate(bullet.id, {
          project: undefined,
          projectMeta: undefined,
        });
      }
    },
    [bullet, onUpdate]
  );

  const handleDelete = useCallback(() => {
    if (bullet && confirm('Delete this task?')) {
      onDelete(bullet.id);
      onClose();
    }
  }, [bullet, onDelete, onClose]);

  return (
    <AnimatePresence>
      {bullet && (
        <>
          {/* Backdrop */}
          <motion.div
            className="orbital-detail__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="orbital-detail"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="orbital-detail__header">
              <h3 className="orbital-detail__title">Edit Task</h3>
              <button
                type="button"
                onClick={onClose}
                className="orbital-detail__close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="orbital-detail__content">
              {/* Text */}
              <div className="orbital-detail__field">
                <label className="orbital-detail__label">Task</label>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onBlur={handleTextSave}
                  className="orbital-detail__textarea"
                  rows={3}
                />
              </div>

              {/* Lane */}
              <div className="orbital-detail__field">
                <label className="orbital-detail__label">Priority</label>
                <div className="orbital-detail__lane-buttons">
                  {LANE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleLaneChange(option.value)}
                      className={`orbital-detail__lane-btn ${option.color} ${lane === option.value ? 'orbital-detail__lane-btn--active' : 'opacity-40'}`}
                    >
                      {option.label}
                      {lane === option.value && <Check className="h-3 w-3 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project */}
              <div className="orbital-detail__field">
                <label className="orbital-detail__label">Project</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProjectPicker(!showProjectPicker)}
                    className="orbital-detail__project-btn"
                    style={{
                      borderColor: projectId ? `var(--project-${projectColor})` : undefined,
                    }}
                  >
                    {projectLabel || 'No project (Inbox)'}
                  </button>

                  {showProjectPicker && (
                    <div className="orbital-detail__project-picker">
                      <button
                        type="button"
                        onClick={() => handleProjectSelect(null)}
                        className="orbital-detail__project-option"
                      >
                        <span className="opacity-60">No project (Inbox)</span>
                      </button>
                      {projects.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleProjectSelect(p)}
                          className="orbital-detail__project-option"
                        >
                          <span
                            className="orbital-detail__project-dot"
                            style={{ backgroundColor: `var(--project-${p.color})` }}
                          />
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="orbital-detail__footer">
              <button
                type="button"
                onClick={handleDelete}
                className="orbital-detail__delete-btn"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
