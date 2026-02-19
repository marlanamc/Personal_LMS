'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Student {
    id: string;
    name: string | null;
    username: string;
    points: number;
    weeklyPoints: number;
    currentStreak: number;
    longestStreak: number;
    lastActive: Date | null;
    favoriteActivity?: string;
    activitiesToday: number;
}

interface StudentEngagementTableProps {
    students: Student[];
}

type SortField = 'name' | 'streak' | 'points' | 'weeklyPoints' | 'lastActive';
type SortDirection = 'asc' | 'desc';

function SortButton({
    field,
    label,
    activeField,
    direction,
    onSort,
}: {
    field: SortField;
    label: string;
    activeField: SortField;
    direction: SortDirection;
    onSort: (field: SortField) => void;
}) {
    return (
        <button
            onClick={() => onSort(field)}
            className="flex items-center gap-1 hover:text-primary transition-colors min-h-[44px] py-2"
        >
            {label}
            {activeField === field && (
                <span className="text-xs">
                    {direction === 'asc' ? '↑' : '↓'}
                </span>
            )}
        </button>
    );
}

export default function StudentEngagementTable({ students }: StudentEngagementTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Filter and sort students
    const filteredAndSortedStudents = useMemo(() => {
        const filtered = students.filter(student =>
            (student.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            student.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

        filtered.sort((a, b) => {
            let compareValue = 0;

            switch (sortField) {
                case 'name':
                    compareValue = (a.name || '').localeCompare(b.name || '');
                    break;
                case 'streak':
                    compareValue = (a.currentStreak || 0) - (b.currentStreak || 0);
                    break;
                case 'points':
                    compareValue = (a.points || 0) - (b.points || 0);
                    break;
                case 'weeklyPoints':
                    compareValue = (a.weeklyPoints || 0) - (b.weeklyPoints || 0);
                    break;
                case 'lastActive':
                    const aTime = a.lastActive?.getTime() || 0;
                    const bTime = b.lastActive?.getTime() || 0;
                    compareValue = aTime - bTime;
                    break;
            }

            return sortDirection === 'asc' ? compareValue : -compareValue;
        });

        return filtered;
    }, [students, searchQuery, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc'); // Default to descending for numbers
        }
    };

    const getLastActiveText = (lastActive: Date | null) => {
        if (!lastActive) return 'Never';
        const now = new Date();
        const diffMs = now.getTime() - lastActive.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return `${diffDays} days ago`;
    };

    const isActiveToday = (lastActive: Date | null) => {
        if (!lastActive) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return lastActive >= today;
    };

    return (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-border bg-bg-light">
                <input
                    type="text"
                    placeholder="Search students by name or username…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 min-h-[44px] border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="text-xs text-text-muted mt-2">
                    Showing {filteredAndSortedStudents.length} of {students.length} students
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border">
                {filteredAndSortedStudents.length === 0 ? (
                    <div className="px-4 py-8 text-center text-text-muted">
                        {searchQuery ? 'No students found matching your search' : 'No students yet'}
                    </div>
                ) : (
                    filteredAndSortedStudents.map((student) => {
                        const activeToday = isActiveToday(student.lastActive);
                        const hasStreak = (student.currentStreak || 0) >= 7;
                        const inactive = !student.lastActive ||
                            (new Date().getTime() - student.lastActive.getTime()) > 3 * 86400000;

                        return (
                            <Link
                                key={student.id}
                                href={`/dashboard/students/${student.id}`}
                                className="block p-4 hover:bg-bg-light transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-text truncate">
                                            {student.name || 'No name'}
                                        </div>
                                        <div className="text-xs text-text-muted">
                                            @{student.username}
                                        </div>
                                    </div>
                                    <div className="ml-3 flex-shrink-0">
                                        {activeToday ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                                ✓ Active
                                            </span>
                                        ) : inactive ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                                                ⚠️ Inactive
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-medium">
                                                • Idle
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center justify-between px-3 py-2 bg-bg-light rounded-md">
                                        <span className="text-text-muted text-xs">Streak</span>
                                        <div className="flex items-center gap-1">
                                            <span className={`font-semibold ${hasStreak ? 'text-orange-600' : 'text-text'}`}>
                                                {student.currentStreak || 0}
                                            </span>
                                            {hasStreak && <span>🔥</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between px-3 py-2 bg-bg-light rounded-md">
                                        <span className="text-text-muted text-xs">Total Pts</span>
                                        <span className="font-semibold text-text">
                                            {student.points || 0}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between px-3 py-2 bg-bg-light rounded-md">
                                        <span className="text-text-muted text-xs">This Week</span>
                                        <span className={`font-semibold ${(student.weeklyPoints || 0) > 0 ? 'text-emerald-600' : 'text-text-muted'}`}>
                                            +{student.weeklyPoints || 0}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between px-3 py-2 bg-bg-light rounded-md">
                                        <span className="text-text-muted text-xs">Last Active</span>
                                        <span className="text-text text-xs">
                                            {getLastActiveText(student.lastActive)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-bg-light border-b border-border">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-text">
                                <SortButton field="name" label="Student" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-text">
                                <SortButton field="streak" label="Streak 🔥" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-text">
                                <SortButton field="points" label="Total Points" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-text">
                                <SortButton field="weeklyPoints" label="Weekly Points" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-text">
                                <SortButton field="lastActive" label="Last Active" activeField={sortField} direction={sortDirection} onSort={handleSort} />
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-text">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredAndSortedStudents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                                    {searchQuery ? 'No students found matching your search' : 'No students yet'}
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedStudents.map((student) => {
                                const activeToday = isActiveToday(student.lastActive);
                                const hasStreak = (student.currentStreak || 0) >= 7;
                                const inactive = !student.lastActive ||
                                    (new Date().getTime() - student.lastActive.getTime()) > 3 * 86400000;

                                return (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-bg-light transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/dashboard/students/${student.id}`}
                                                className="flex flex-col hover:text-primary transition-colors"
                                            >
                                                <span className="font-medium text-text">
                                                    {student.name || 'No name'}
                                                </span>
                                                <span className="text-xs text-text-muted">
                                                    @{student.username}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`font-semibold ${hasStreak ? 'text-orange-600' : 'text-text'}`}>
                                                    {student.currentStreak || 0}
                                                </span>
                                                {hasStreak && <span>🔥</span>}
                                            </div>
                                            {student.longestStreak > 0 && (
                                                <div className="text-xs text-text-muted">
                                                    Best: {student.longestStreak}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="font-semibold text-text">
                                                {student.points || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-semibold ${(student.weeklyPoints || 0) > 0 ? 'text-emerald-600' : 'text-text-muted'}`}>
                                                +{student.weeklyPoints || 0}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-text-muted">
                                            {getLastActiveText(student.lastActive)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {activeToday ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                                                    ✓ Active
                                                </span>
                                            ) : inactive ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                                                    ⚠️ Inactive
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-medium">
                                                    • Idle
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
