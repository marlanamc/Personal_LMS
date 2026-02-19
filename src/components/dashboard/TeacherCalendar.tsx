'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { EditableFlow } from './EditableFlow';
import {
  TeachingScheduleFlowItem,
  MonthDay,
  TeachingScheduleDay,
  TeachingSchedule,
  TeachingScheduleWeekDay,
  TeachingScheduleWeek
} from '@/lib/teachingSchedule';

export type { TeachingScheduleDay, TeachingSchedule, TeachingScheduleWeekDay, TeachingScheduleWeek };

function formatMonthDay(date: MonthDay) {
  return new Date(date.year, date.month - 1, date.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function stripMarkdown(text: string): string {
  return text
    // Remove bold/italic markers
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove backticks and code blocks
    .replace(/`(.+?)`/g, '$1')
    // Remove "USE:" instructions (teacher-only metadata)
    .replace(/\s*-\s*USE:\s*`[^`]+`\s*\([^)]+\)/gi, '')
    .trim();
}

function getCurrentWeekIndex(weeklySchedule: TeachingScheduleWeek[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < weeklySchedule.length; i++) {
    const week = weeklySchedule[i];
    if (!week) continue;

    const tueDate = new Date(week.dates.tue.year, week.dates.tue.month - 1, week.dates.tue.day);
    const thuDate = new Date(week.dates.thu.year, week.dates.thu.month - 1, week.dates.thu.day);

    if (today >= tueDate && today <= thuDate) {
      return i;
    }

    if (today < tueDate) {
      return Math.max(0, i - 1);
    }
  }

  return Math.max(0, weeklySchedule.length - 1);
}

function getWeekStatus(week: TeachingScheduleWeek): 'past' | 'current' | 'upcoming' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tueDate = new Date(week.dates.tue.year, week.dates.tue.month - 1, week.dates.tue.day);
  const thuDate = new Date(week.dates.thu.year, week.dates.thu.month - 1, week.dates.thu.day);

  if (today > thuDate) return 'past';
  if (today >= tueDate && today <= thuDate) return 'current';
  return 'upcoming';
}

export function TeacherCalendar({
  teachingSchedule,
  weeklySchedule,
}: {
  teachingSchedule: TeachingSchedule;
  weeklySchedule: TeachingScheduleWeek[];
}) {
  const [selectedWeek, setSelectedWeek] = useState(() =>
    weeklySchedule.length > 0 ? getCurrentWeekIndex(weeklySchedule) : 0
  );
  const [showWeekList, setShowWeekList] = useState(false);
  const [localSchedule, setLocalSchedule] = useState(teachingSchedule);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Sync local schedule when props change
  useEffect(() => {
    setLocalSchedule(teachingSchedule);
  }, [teachingSchedule]);

  const handleSaveFlow = async (day: "Tuesday" | "Thursday", flow: TeachingScheduleFlowItem[]) => {
    const response = await fetch("/api/teaching-schedule/flow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ day, flow }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to save flow");
    }

    // Update local state
    setLocalSchedule({
      ...localSchedule,
      [day]: {
        ...localSchedule[day],
        flow,
      },
    });
  };

  const handleReleaseSpeaking = async (date: MonthDay, day: 'Tuesday' | 'Thursday') => {
    const actionKey = `release-speaking-${date.year}-${date.month}-${date.day}`;
    setLoadingAction(actionKey);
    try {
      // Format date as YYYY-MM-DD
      const dateStr = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      const activityId = `speaking-${dateStr}`;

      const response = await fetch("/api/speaking/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId, released: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to release speaking activity");
      }

      alert(`✓ Speaking activity released for ${day}!`);
    } catch (error) {
      console.error('Error releasing speaking activity:', error);
      alert(error instanceof Error ? error.message : "Failed to release activity");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFeatureSpeaking = async (date: MonthDay, day: 'Tuesday' | 'Thursday') => {
    const actionKey = `feature-speaking-${date.year}-${date.month}-${date.day}`;
    setLoadingAction(actionKey);
    try {
      // Format date as YYYY-MM-DD
      const dateStr = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      const activityId = `speaking-${dateStr}`;

      // Get all teacher's classes
      const classesResponse = await fetch('/api/classes');
      if (!classesResponse.ok) {
        throw new Error('Failed to fetch classes');
      }
      const classes = await classesResponse.json();

      if (!classes || classes.length === 0) {
        alert('You need to create a class first!');
        return;
      }

      // For each class, create/find assignment and feature it
      let featuredCount = 0;
      for (const cls of classes) {
        // Check if assignment already exists
        const existingAssignments = cls.assignments || [];
        const assignment = existingAssignments.find((a: any) => a.activityId === activityId);

        if (!assignment) {
          // Create new assignment
          const createResponse = await fetch('/api/assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              classId: cls.id,
              activityId,
              title: `${day} Speaking Warmup`,
              isFeatured: true,
            }),
          });

          if (createResponse.ok) {
            featuredCount++;
          }
        } else {
          // Update existing assignment to be featured
          const updateResponse = await fetch('/api/assignments', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assignmentId: assignment.id,
              isFeatured: true,
            }),
          });

          if (updateResponse.ok) {
            featuredCount++;
          }
        }
      }

      alert(`✓ Speaking activity featured for ${featuredCount} class${featuredCount === 1 ? '' : 'es'}!`);
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error('Error featuring speaking activity:', error);
      alert(error instanceof Error ? error.message : "Failed to feature activity");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAssignGrammar = async (grammarTopic: string, day: 'Tuesday' | 'Thursday') => {
    const actionKey = `assign-${day}-${grammarTopic}`;
    setLoadingAction(actionKey);
    try {
      // Get teacher's classes
      const classesResponse = await fetch('/api/classes');
      if (!classesResponse.ok) {
        throw new Error('Failed to fetch classes');
      }
      const classes = await classesResponse.json();

      if (!classes || classes.length === 0) {
        alert('You need to create a class first!');
        return;
      }

      // Search for the grammar activity
      const activitiesResponse = await fetch('/api/activities');
      if (!activitiesResponse.ok) {
        throw new Error('Failed to fetch activities');
      }
      const activities = await activitiesResponse.json();

      // Find grammar activity that matches the topic
      const grammarActivity = activities.find((a: any) =>
        a.category === 'grammar' &&
        a.title.toLowerCase().includes(grammarTopic.toLowerCase())
      );

      if (!grammarActivity) {
        alert(`Could not find grammar activity for: ${grammarTopic}\n\nPlease assign it manually from Dashboard > Activities`);
        return;
      }

      // Create assignment for all classes
      let assignedCount = 0;
      for (const cls of classes) {
        // Check if already assigned
        const alreadyAssigned = cls.assignments?.some((a: any) => a.activityId === grammarActivity.id);
        if (alreadyAssigned) {
          continue;
        }

        const response = await fetch('/api/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classId: cls.id,
            activityId: grammarActivity.id,
            title: `${day} - ${grammarTopic}`,
          }),
        });

        if (response.ok) {
          assignedCount++;
        }
      }

      if (assignedCount > 0) {
        alert(`✓ Grammar assigned to ${assignedCount} class${assignedCount === 1 ? '' : 'es'}!`);
        window.location.reload();
      } else {
        alert('Activity already assigned to all classes');
      }
    } catch (error) {
      console.error('Error assigning grammar:', error);
      alert(error instanceof Error ? error.message : "Failed to assign grammar");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReleaseQuiz = async (weekName: string) => {
    setLoadingAction('release-quiz');
    try {
      // Get teacher's classes
      const classesResponse = await fetch('/api/classes');
      if (!classesResponse.ok) {
        throw new Error('Failed to fetch classes');
      }
      const classes = await classesResponse.json();

      if (!classes || classes.length === 0) {
        alert('You need to create a class first!');
        return;
      }

      // Search for verb quiz activity for this week
      const activitiesResponse = await fetch('/api/activities');
      if (!activitiesResponse.ok) {
        throw new Error('Failed to fetch activities');
      }
      const activities = await activitiesResponse.json();

      // Find verb quiz (look for quiz type with "verb" in title)
      const verbQuizzes = activities.filter((a: any) =>
        a.type === 'quiz' &&
        a.title.toLowerCase().includes('verb')
      );

      if (verbQuizzes.length === 0) {
        alert('No verb quizzes found. Please create or import verb quizzes first.');
        return;
      }

      // Use the first verb quiz (ideally we'd match by week, but this works for now)
      const quizToRelease = verbQuizzes[0];

      // Assign to all classes
      let assignedCount = 0;
      for (const cls of classes) {
        // Check if already assigned
        const alreadyAssigned = cls.assignments?.some((a: any) => a.activityId === quizToRelease.id);
        if (alreadyAssigned) {
          continue;
        }

        const response = await fetch('/api/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            classId: cls.id,
            activityId: quizToRelease.id,
            title: `${weekName} - Verb Quiz`,
          }),
        });

        if (response.ok) {
          assignedCount++;
        }
      }

      if (assignedCount > 0) {
        alert(`✓ Verb quiz assigned to ${assignedCount} class${assignedCount === 1 ? '' : 'es'}!`);
        window.location.reload();
      } else {
        alert('Verb quiz already assigned to all classes');
      }
    } catch (error) {
      console.error('Error releasing quiz:', error);
      alert(error instanceof Error ? error.message : "Failed to release quiz");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAutoReleaseAll = async (week: TeachingScheduleWeek) => {
    setLoadingAction('auto-release-all');
    try {
      const tasks: string[] = [];

      // Release Tuesday speaking
      try {
        await handleReleaseSpeaking(week.dates.tue, 'Tuesday');
        tasks.push('✓ Tuesday speaking released');
      } catch (error) {
        tasks.push('✗ Tuesday speaking failed');
      }

      // Release Thursday speaking
      try {
        await handleReleaseSpeaking(week.dates.thu, 'Thursday');
        tasks.push('✓ Thursday speaking released');
      } catch (error) {
        tasks.push('✗ Thursday speaking failed');
      }

      // Assign Tuesday grammar if available
      if (week.tuesday.grammar) {
        try {
          await handleAssignGrammar(stripMarkdown(week.tuesday.grammar), 'Tuesday');
          tasks.push('✓ Tuesday grammar assigned');
        } catch (error) {
          tasks.push('✗ Tuesday grammar failed');
        }
      }

      // Assign Thursday grammar if available
      if (week.thursday.grammar) {
        try {
          await handleAssignGrammar(stripMarkdown(week.thursday.grammar), 'Thursday');
          tasks.push('✓ Thursday grammar assigned');
        } catch (error) {
          tasks.push('✗ Thursday grammar failed');
        }
      }

      // Release verb quiz
      try {
        await handleReleaseQuiz(week.week);
        tasks.push('✓ Verb quiz released');
      } catch (error) {
        tasks.push('✗ Verb quiz failed');
      }

      alert('Auto-Release Complete!\n\n' + tasks.join('\n'));
      window.location.reload();
    } catch (error) {
      console.error('Error in auto-release:', error);
      alert(error instanceof Error ? error.message : "Auto-release failed");
    } finally {
      setLoadingAction(null);
    }
  };

  const currentWeek = weeklySchedule[selectedWeek];
  const hasWeeks = weeklySchedule.length > 0 && !!currentWeek;
  const maxWeekIndex = Math.max(0, weeklySchedule.length - 1);
  const currentWeekIndex = getCurrentWeekIndex(weeklySchedule);
  const progressPercentage = hasWeeks ? Math.round(((selectedWeek + 1) / weeklySchedule.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ADHD-Friendly Header with Progress */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-semibold text-text">Teaching Schedule</h2>
            <p className="text-sm text-text/80 mt-1">
              ESOL Level 3 — Jan–Jun 2026 | Tue/Thu 6:00–8:15pm
            </p>
          </div>

          <button
            onClick={() => setShowWeekList(!showWeekList)}
            className="px-4 py-2 rounded-lg border border-border/50 hover:bg-bg-light transition text-sm font-medium text-text flex items-center gap-2"
          >
            {showWeekList ? '📅 Hide Week List' : '📋 Show All Weeks'}
          </button>
        </div>

        {/* Progress Bar */}
        {hasWeeks && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-text">
                Viewing: Week {selectedWeek + 1} of {weeklySchedule.length}
              </span>
              <span className="text-text/75">{progressPercentage}% through semester</span>
            </div>
            <div className="w-full bg-border/30 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary transition-[width] duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedWeek((prev) => Math.max(0, prev - 1))}
            disabled={!hasWeeks || selectedWeek === 0}
            className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-primary transition"
          >
            ← Previous
          </button>

          <button
            onClick={() => setSelectedWeek(currentWeekIndex)}
            disabled={!hasWeeks || selectedWeek === currentWeekIndex}
            className="px-4 py-2 rounded-lg bg-accent/80 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold text-text transition shadow-sm"
          >
            📍 Jump to Current Week
          </button>

          <button
            onClick={() => setSelectedWeek((prev) => Math.min(maxWeekIndex, prev + 1))}
            disabled={!hasWeeks || selectedWeek === maxWeekIndex}
            className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-primary transition"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Week List View (Collapsible) */}
      {showWeekList && hasWeeks && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text mb-4">All Weeks at a Glance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {weeklySchedule.map((week, index) => {
              const status = getWeekStatus(week);
              const isCurrent = status === 'current';
              const isPast = status === 'past';
              const isSelected = index === selectedWeek;

              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedWeek(index);
                    setShowWeekList(false);
                  }}
                  className={`
                    text-left p-4 rounded-lg border-2 transition-[border-color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
                    ${isSelected ? 'border-primary bg-primary/10 shadow-md' : 'border-border/30 hover:border-primary/40 hover:bg-bg-light'}
                    ${isCurrent ? 'ring-2 ring-accent ring-offset-2' : ''}
                    ${isPast ? 'opacity-60' : ''}
                  `}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-text text-sm">{week.week}</span>
                    {isCurrent && (
                      <span className="text-xs font-bold bg-accent text-text px-2 py-0.5 rounded">NOW</span>
                    )}
                    {isPast && (
                      <span className="text-xs font-medium text-text/70">✓ Past</span>
                    )}
                  </div>
                  <div className="text-xs text-text/75">
                    {formatMonthDay(week.dates.tue)} – {formatMonthDay(week.dates.thu)}
                  </div>
                  <div className="text-xs text-text/80 mt-2 line-clamp-2">
                    {stripMarkdown(week.tuesday.grammar || week.tuesday.warmup)}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Week Detail View */}
      <Card className="p-6">
        {!hasWeeks ? (
          <div className="text-sm text-text/80">No schedule data found.</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">{currentWeek.week}</h3>
              {getWeekStatus(currentWeek) === 'current' && (
                <span className="text-sm font-bold bg-accent text-text px-3 py-1 rounded-full">📍 Current Week</span>
              )}
              {getWeekStatus(currentWeek) === 'past' && (
                <span className="text-sm font-medium text-text/75 px-3 py-1 rounded-full border border-border/30">✓ Completed</span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tuesday */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text">
                    Tuesday {formatMonthDay(currentWeek.dates.tue)}
                  </h4>
                  {localSchedule.Tuesday.time && (
                    <span className="text-sm text-text/75">{localSchedule.Tuesday.time}</span>
                  )}
                </div>

                <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                  {currentWeek.tuesday.grammar && (
                    <div className={currentWeek.tuesday.notes ? "pb-3 border-b border-primary/20" : ""}>
                      <div className="text-xs font-medium text-primary uppercase mb-1">📖 Grammar Lesson</div>
                      <div className="font-medium text-text">{stripMarkdown(currentWeek.tuesday.grammar)}</div>
                    </div>
                  )}

                  {currentWeek.tuesday.notes && (
                    <div>
                      <div className="text-xs font-medium text-text/75 uppercase mb-1">📝 Notes</div>
                      <div className="text-sm text-text/80">{stripMarkdown(currentWeek.tuesday.notes)}</div>
                    </div>
                  )}

                  <EditableFlow
                    flow={currentWeek.tuesday.flow}
                    day="Tuesday"
                    onSave={(flow) => handleSaveFlow("Tuesday", flow)}
                  />
                </div>
              </div>

              {/* Thursday */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-text">
                    Thursday {formatMonthDay(currentWeek.dates.thu)}
                  </h4>
                  {localSchedule.Thursday.time && (
                    <span className="text-sm text-text/75">{localSchedule.Thursday.time}</span>
                  )}
                </div>

                <div className="bg-secondary/5 rounded-lg p-4 space-y-3">
                  {currentWeek.thursday.quiz && (
                    <div className="pb-3 border-b border-orange-300">
                      <div className="text-xs font-medium text-orange-800 uppercase mb-1">⚠️ Unit Quiz</div>
                      <div className="font-medium text-text">{currentWeek.thursday.quiz}</div>
                    </div>
                  )}

                  {currentWeek.thursday.grammar && (
                    <div className={currentWeek.thursday.notes ? "pb-3 border-b border-secondary/20" : ""}>
                      <div className="text-xs font-medium text-secondary uppercase mb-1">📖 Grammar Review</div>
                      <div className="font-medium text-text">{stripMarkdown(currentWeek.thursday.grammar)}</div>
                    </div>
                  )}

                  {currentWeek.thursday.notes && (
                    <div>
                      <div className="text-xs font-medium text-text/75 uppercase mb-1">📝 Notes</div>
                      <div className="text-sm text-text/80">{stripMarkdown(currentWeek.thursday.notes)}</div>
                    </div>
                  )}

                  <EditableFlow
                    flow={currentWeek.thursday.flow}
                    day="Thursday"
                    onSave={(flow) => handleSaveFlow("Thursday", flow)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20"></div>
          <span className="text-text/80">Grammar Lesson</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-secondary/20"></div>
          <span className="text-text/80">Speaking Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/20"></div>
          <span className="text-text/80">Quiz/Assessment</span>
        </div>
      </div>
    </div>
  );
}
