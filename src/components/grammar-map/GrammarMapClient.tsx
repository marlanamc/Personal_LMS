'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { categoryColors, categoryLabels, type GrammarTopic } from '@/data/grammar-map';
import { Check, Loader2, ArrowRight, ZoomIn, ZoomOut, Maximize2, List } from 'lucide-react';

interface ProgressData {
    completionPercentage: number;
    status: string;
}

interface GrammarMapClientProps {
    progressMap: Record<string, ProgressData>;
    topics: GrammarTopic[];
}

interface NodePosition {
    x: number;
    y: number;
}

interface Edge {
    from: string;
    to: string;
    type: 'prerequisite' | 'related';
}

const CATEGORY_ORDER: GrammarTopic['category'][] = [
    'foundation',
    'writing',
    'tenses',
    'gerunds-infinitives',
    'modals',
    'advanced',
];

const TENSE_SUBCATEGORY_ORDER: Array<NonNullable<GrammarTopic['subcategory']>> = [
    'simple',
    'continuous',
    'perfect',
    'perfect-continuous',
];

const tenseSubcategoryLabels: Record<NonNullable<GrammarTopic['subcategory']>, string> = {
    simple: 'Simple',
    continuous: 'Continuous',
    perfect: 'Perfect',
    'perfect-continuous': 'Perfect Continuous',
};

export default function GrammarMapClient({ progressMap, topics }: GrammarMapClientProps) {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
    const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
    const [edges, setEdges] = useState<Edge[]>([]);
    const [zoom, setZoom] = useState<number>(1);
    const [viewMode, setViewMode] = useState<'graph' | 'list'>('list');
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const weekRange = useMemo(() => {
        const weeks = topics.map((t) => t.week).filter((w): w is number => typeof w === 'number' && Number.isFinite(w));
        if (!weeks.length) return { minWeek: 0, maxWeek: 0, weeks: [] as number[] };
        const uniqueWeeks = Array.from(new Set(weeks)).sort((a, b) => a - b);
        return { minWeek: Math.min(...uniqueWeeks), maxWeek: Math.max(...uniqueWeeks), weeks: uniqueWeeks };
    }, [topics]);

    const lanes = useMemo(() => {
        const topicsByWeek: Record<number, GrammarTopic[]> = {};
        topics.forEach((topic) => {
            const week = topic.week || 0;
            if (!topicsByWeek[week]) topicsByWeek[week] = [];
            topicsByWeek[week].push(topic);
        });

        const nodeHeight = 90;
        const stackGap = 14;
        const laneGap = 34;
        const topPad = 90;

        const laneMaxStack: Record<GrammarTopic['category'], number> = {
            foundation: 1,
            tenses: 1,
            'gerunds-infinitives': 1,
            modals: 1,
            advanced: 1,
            writing: 1,
        };

        for (const topics of Object.values(topicsByWeek)) {
            const counts: Record<string, number> = {};
            for (const topic of topics) {
                counts[topic.category] = (counts[topic.category] || 0) + 1;
            }
            for (const [category, count] of Object.entries(counts)) {
                const cat = category as GrammarTopic['category'];
                laneMaxStack[cat] = Math.max(laneMaxStack[cat] ?? 1, count);
            }
        }

        let cursorY = topPad;
        const result: { category: GrammarTopic['category']; y: number; height: number }[] = [];
        for (const category of CATEGORY_ORDER) {
            const height = laneMaxStack[category] * (nodeHeight + stackGap) - stackGap;
            result.push({ category, y: cursorY, height });
            cursorY += height + laneGap;
        }

        return result;
    }, [topics]);

    // Calculate node positions based on week + category lanes (game-map layout)
    useEffect(() => {
        const positions: Record<string, NodePosition> = {};
        const edgesList: Edge[] = [];

        // Group topics by week
        const topicsByWeek: Record<number, GrammarTopic[]> = {};
        topics.forEach(topic => {
            const week = topic.week || 0;
            if (!topicsByWeek[week]) {
                topicsByWeek[week] = [];
            }
            topicsByWeek[week].push(topic);
        });

        const nodeWidth = 220;
        const nodeHeight = 90;
        const stackGap = 14;
        const laneGap = 34;
        const leftPad = 80;
        const topPad = 90;
        const weekGap = 140;

        const laneMaxStack: Record<GrammarTopic['category'], number> = {
            foundation: 1,
            tenses: 1,
            'gerunds-infinitives': 1,
            modals: 1,
            advanced: 1,
            writing: 1,
        };

        for (const topics of Object.values(topicsByWeek)) {
            const counts: Record<string, number> = {};
            for (const topic of topics) {
                counts[topic.category] = (counts[topic.category] || 0) + 1;
            }
            for (const [category, count] of Object.entries(counts)) {
                const cat = category as GrammarTopic['category'];
                laneMaxStack[cat] = Math.max(laneMaxStack[cat] ?? 1, count);
            }
        }

        const laneStartY: Record<GrammarTopic['category'], number> = {
            foundation: 0,
            tenses: 0,
            'gerunds-infinitives': 0,
            modals: 0,
            advanced: 0,
            writing: 0,
        };

        let cursorY = topPad;
        for (const category of CATEGORY_ORDER) {
            laneStartY[category] = cursorY;
            cursorY += laneMaxStack[category] * (nodeHeight + stackGap) - stackGap + laneGap;
        }

        const stackIndexByWeekAndCategory = new Map<string, number>();

        for (const [week, topics] of Object.entries(topicsByWeek)) {
            const weekNum = Number.parseInt(week, 10);
            const weekIndex = weekNum - weekRange.minWeek;
            const x = leftPad + weekIndex * (nodeWidth + weekGap);

            for (const topic of topics) {
                const key = `${weekNum}:${topic.category}`;
                const stackIndex = stackIndexByWeekAndCategory.get(key) ?? 0;
                stackIndexByWeekAndCategory.set(key, stackIndex + 1);

                const y = laneStartY[topic.category] + stackIndex * (nodeHeight + stackGap);
                positions[topic.id] = { x, y };

                // Create edges for prerequisites
                if (topic.prerequisites) {
                    topic.prerequisites.forEach(prereqId => {
                        edgesList.push({
                            from: prereqId,
                            to: topic.id,
                            type: 'prerequisite'
                        });
                    });
                }

                // Create edges for related topics
                if (topic.relatedTopics) {
                    topic.relatedTopics.forEach(relatedId => {
                        // Only add if not already added as prerequisite
                        const existingEdge = edgesList.find(
                            e => (e.from === relatedId && e.to === topic.id) ||
                                 (e.from === topic.id && e.to === relatedId)
                        );
                        if (!existingEdge) {
                            edgesList.push({
                                from: topic.id,
                                to: relatedId,
                                type: 'related'
                            });
                        }
                    });
                }
            }
        }

        setNodePositions(positions);
        setEdges(edgesList);
    }, [weekRange.minWeek, topics]);

    // Get completion status for a topic
    const arePrereqsMet = (topic: GrammarTopic): boolean => {
        if (!topic.prerequisites || topic.prerequisites.length === 0) return true;
        return topic.prerequisites.every((prereqId) => {
            const prereqProgress = progressMap[prereqId];
            return !!prereqProgress && prereqProgress.completionPercentage >= 80;
        });
    };

    const getTopicStatus = (topic: GrammarTopic): 'completed' | 'in-progress' | 'available' => {
        const progress = progressMap[topic.id];

        if (progress) {
            if (progress.completionPercentage >= 80) return 'completed';
            if (progress.completionPercentage > 0) return 'in-progress';
        }

        return 'available';
    };

    // Get suggested next topics
    const getSuggestedNext = (): string[] => {
        const suggested: string[] = [];

        for (const topic of topics) {
            const status = getTopicStatus(topic);
            if (status === 'available') {
                // Check if this is a logical next step (prerequisites completed, not started yet)
                const progress = progressMap[topic.id] ?? null;
                if (!progress || progress.completionPercentage === 0) {
                    suggested.push(topic.id);
                    if (suggested.length >= 3) break; // Only suggest top 3
                }
            }
        }

        return suggested;
    };

    const suggestedTopics = getSuggestedNext();

    // Get node color based on status
    const getNodeColor = (topic: GrammarTopic): string => {
        const status = getTopicStatus(topic);
        const prereqsMet = arePrereqsMet(topic);
        const baseColor = categoryColors[topic.category];

        switch (status) {
            case 'completed':
                return '#22c55e'; // Green
            case 'in-progress':
                return '#f59e0b'; // Amber
            case 'available':
            default:
                return prereqsMet ? baseColor : '#94a3b8'; // Slate for "recommended first"
        }
    };

    // Get status icon
    const getStatusIcon = (topic: GrammarTopic) => {
        const status = getTopicStatus(topic);

        switch (status) {
            case 'completed':
                return <Check className="w-6 h-6" />;
            case 'in-progress':
                return <Loader2 className="w-6 h-6" />;
            default:
                return null;
        }
    };

    const handleTopicClick = (topicId: string) => {
        // Navigate to the grammar guide (using topic ID as the route slug)
        window.location.assign(`/grammar-reader/${topicId}?from=grammar-map`);
    };

    const getTenseCardOrder = (topic: GrammarTopic): number => {
        const title = topic.title.toLowerCase();
        if (title.startsWith('present ')) return 0;
        if (title.startsWith('past ')) return 1;
        if (title.startsWith('future ')) return 2;
        if (title.includes('review')) return 3;
        if (title.includes('overview')) return 4;
        return 99;
    };

    const renderTopicCard = (topic: GrammarTopic, extraClassName = "") => {
        const progress = progressMap[topic.id] ?? null;
        const color = getNodeColor(topic);

        return (
            <button
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                className={`text-left p-4 rounded-lg border-2 transition-[box-shadow] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 ${extraClassName}`}
                style={{
                    borderColor: color,
                    backgroundColor: `${color}10`,
                }}
            >
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-[var(--text)] flex-1">
                        {topic.title}
                    </h4>
                    {getStatusIcon(topic) && (
                        <div style={{ color }}>{getStatusIcon(topic)}</div>
                    )}
                </div>
                {progress && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>{progress.completionPercentage}% complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="h-2 rounded-full transition-[width]"
                                style={{
                                    width: `${progress.completionPercentage}%`,
                                    backgroundColor: color,
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </button>
        );
    };

    const nodeWidth = 220;
    const nodeHeight = 90;
    const weekGap = 140;
    const leftPad = 80;
    const rightPad = 160;
    const topPad = 90;
    const bottomPad = 140;

    const canvas = useMemo(() => {
        const widthWeeks = Math.max(1, weekRange.maxWeek - weekRange.minWeek + 1);
        const width = leftPad + widthWeeks * (nodeWidth + weekGap) - weekGap + rightPad;

        const ys = Object.values(nodePositions).map((p) => p.y);
        const height = (ys.length ? Math.max(...ys) + nodeHeight : topPad) + bottomPad;

        return { width, height };
    }, [nodePositions, weekRange.maxWeek, weekRange.minWeek]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
    const handleZoomReset = () => {
        setZoom(1);
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full">
            {/* Controls Bar */}
            <div className="mb-4 flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('graph')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            viewMode === 'graph'
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Map View</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            viewMode === 'list'
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <List className="w-4 h-4" />
                        <span className="text-sm font-medium">List View</span>
                    </button>
                </div>

                {viewMode === 'graph' && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 mr-2">Zoom: {Math.round(zoom * 100)}%</span>
                        <button
                            onClick={handleZoomOut}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            title="Zoom Out"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleZoomReset}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            title="Reset Zoom"
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleZoomIn}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            title="Zoom In"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Legend - Only show in graph view */}
            {viewMode === 'graph' && (
                <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-sm">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                            <span className="text-sm">Not Started</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-blue-500" />
                            <span className="text-sm">Suggested Next</span>
                        </div>
                    </div>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                    {CATEGORY_ORDER.map(category => {
                        const topicsInCategory = topics.filter(t => t.category === category);
                        if (topicsInCategory.length === 0) return null;

                        return (
                            <div key={category} className="mb-8 last:mb-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ backgroundColor: categoryColors[category] }}
                                    ></div>
                                    <h3 className="text-xl font-bold text-[var(--text)]">
                                        {categoryLabels[category]}
                                    </h3>
                                </div>

                                {category === 'tenses' ? (
                                    <div className="space-y-6">
                                        {TENSE_SUBCATEGORY_ORDER.map((subcategory) => {
                                            const topics = topicsInCategory.filter(
                                                (t) => t.id !== 'all-verb-tenses-overview' && t.subcategory === subcategory
                                            );
                                            if (!topics.length) return null;

                                            return (
                                                <div key={subcategory}>
                                                    <div className="flex items-baseline gap-3 mb-2">
                                                        <h4 className="text-sm font-bold text-gray-700 tracking-wide uppercase">
                                                            {tenseSubcategoryLabels[subcategory]}
                                                        </h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                        {topics
                                                            .slice()
                                                            .sort((a, b) => {
                                                                const aKey = getTenseCardOrder(a);
                                                                const bKey = getTenseCardOrder(b);
                                                                if (aKey !== bKey) return aKey - bKey;
                                                                return (a.week || 0) - (b.week || 0);
                                                            })
                                                            .map((topic) => renderTopicCard(topic))}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {topicsInCategory.some((t) => t.id === 'all-verb-tenses-overview') && (
                                            <div className="pt-2">
                                                <div className="flex items-baseline justify-between gap-3 mb-2">
                                                    <h4 className="text-sm font-bold text-gray-700 tracking-wide uppercase">
                                                        Big Picture
                                                    </h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    {topicsInCategory
                                                        .filter((t) => t.id === 'all-verb-tenses-overview')
                                                        .map((topic) =>
                                                            renderTopicCard(
                                                                topic,
                                                                "md:col-span-2 lg:col-span-4 bg-gradient-to-r from-white to-white/60"
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {topicsInCategory
                                            .slice()
                                            .sort((a, b) => (a.week || 0) - (b.week || 0))
                                            .map((topic) => renderTopicCard(topic))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Network Graph */}
            {viewMode === 'graph' && (
                <div
                    ref={containerRef}
                    className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto relative"
                    style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}
                >
                    {/* Scroll hint */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-sm text-gray-600 pointer-events-none">
                        💡 Scroll to explore • Click topics to learn
                    </div>

                    <svg
                        ref={svgRef}
                        width={canvas.width * zoom}
                        height={canvas.height * zoom}
                        className="block"
                        style={{ transformOrigin: '0 0' }}
                    >
                    <defs>
                        <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f8fafc" />
                            <stop offset="45%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#f1f5f9" />
                        </linearGradient>
                        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                        </pattern>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.14" />
                        </filter>
                    </defs>

                    {/* Background */}
                    <rect x="0" y="0" width={canvas.width} height={canvas.height} fill="url(#mapBg)" />
                    <rect x="0" y="0" width={canvas.width} height={canvas.height} fill="url(#grid)" opacity="0.55" />

                    {/* Category lanes */}
                    <g>
                        {lanes.map((lane) => (
                            <g key={lane.category}>
                                <rect
                                    x="18"
                                    y={lane.y - 10}
                                    width={canvas.width - 36}
                                    height={lane.height + 20}
                                    rx="18"
                                    fill={categoryColors[lane.category]}
                                    opacity="0.06"
                                />
                                <rect
                                    x="24"
                                    y={lane.y + lane.height / 2 - 16}
                                    width="154"
                                    height="32"
                                    rx="12"
                                    fill={categoryColors[lane.category]}
                                    opacity="0.92"
                                />
                                <text
                                    x="101"
                                    y={lane.y + lane.height / 2 + 6}
                                    textAnchor="middle"
                                    className="text-sm font-semibold fill-white"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {categoryLabels[lane.category]}
                                </text>
                            </g>
                        ))}
                    </g>

                    {/* Render edges */}
                    <g className="edges">
                        {edges.map((edge, index) => {
                            const fromPos = nodePositions[edge.from];
                            const toPos = nodePositions[edge.to];

                            if (!fromPos || !toPos) return null;

                            const isHighlighted =
                                hoveredTopic === edge.from ||
                                hoveredTopic === edge.to ||
                                selectedTopic === edge.from ||
                                selectedTopic === edge.to;

                            const x1 = fromPos.x + nodeWidth / 2;
                            const y1 = fromPos.y + nodeHeight / 2;
                            const x2 = toPos.x + nodeWidth / 2;
                            const y2 = toPos.y + nodeHeight / 2;
                            const dx = Math.max(60, Math.abs(x2 - x1) * 0.5);

                            return (
                                <motion.path
                                    key={`${edge.from}-${edge.to}-${index}`}
                                    d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                                    fill="none"
                                    stroke={edge.type === 'prerequisite' ? '#2563eb' : '#cbd5e1'}
                                    strokeWidth={isHighlighted ? 3 : edge.type === 'prerequisite' ? 2 : 1.25}
                                    strokeDasharray={edge.type === 'related' ? '6,6' : '0'}
                                    opacity={isHighlighted ? 1 : 0.35}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: isHighlighted ? 1 : 0.35 }}
                                    transition={{ duration: 0.5, delay: index * 0.01 }}
                                />
                            );
                        })}
                    </g>

                    {/* Render nodes */}
                    <g className="nodes">
                        {topics.map((topic, index) => {
                            const pos = nodePositions[topic.id];
                            if (!pos) return null;

                            const status = getTopicStatus(topic);
                            const color = getNodeColor(topic);
                            const prereqsMet = arePrereqsMet(topic);
                            const isSuggested = suggestedTopics.includes(topic.id);
                            const isHovered = hoveredTopic === topic.id;
                            const isSelected = selectedTopic === topic.id;
                            const isDimmed = status === 'available' && !prereqsMet;

                            return (
                                <g key={topic.id}>
                                    {/* Suggested indicator */}
                                    {isSuggested && (
                                        <motion.circle
                                            cx={pos.x + nodeWidth / 2}
                                            cy={pos.y + nodeHeight / 2}
                                            r="65"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="3"
                                            strokeDasharray="5,5"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}

                                    {/* Node */}
                                    <motion.g
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: zoom, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onMouseEnter={() => setHoveredTopic(topic.id)}
                                        onMouseLeave={() => setHoveredTopic(null)}
                                        onClick={() => {
                                            setSelectedTopic(topic.id);
                                            handleTopicClick(topic.id);
                                        }}
                                        className="cursor-pointer"
                                        whileHover={{ scale: zoom * 1.05 }}
                                        whileTap={{ scale: zoom * 0.95 }}
                                        style={{ transformOrigin: `${pos.x + nodeWidth / 2}px ${pos.y + nodeHeight / 2}px` }}
                                    >
                                        {/* Node background */}
                                        <rect
                                            x={pos.x}
                                            y={pos.y}
                                            width={nodeWidth}
                                            height={nodeHeight}
                                            rx="14"
                                            fill={color}
                                            opacity={isDimmed ? 0.55 : 1}
                                            stroke={isSelected ? '#0f172a' : isHovered ? '#334155' : 'rgba(255,255,255,0.55)'}
                                            strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                                            filter="url(#shadow)"
                                        />

                                        {/* Topic title */}
                                        <text
                                            x={pos.x + nodeWidth / 2}
                                            y={pos.y + nodeHeight / 2 + 5}
                                            textAnchor="middle"
                                            className="text-sm font-semibold fill-white"
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {topic.title.length > 25
                                                ? topic.title.substring(0, 25) + '...'
                                                : topic.title}
                                        </text>

                                        {/* Status icon */}
                                        <foreignObject
                                            x={pos.x + nodeWidth - 36}
                                            y={pos.y + 10}
                                            width="28"
                                            height="28"
                                        >
                                            <div className="flex items-center justify-center w-full h-full text-white">
                                                {getStatusIcon(topic)}
                                            </div>
                                        </foreignObject>
                                    </motion.g>
                                </g>
                            );
                        })}
                    </g>
                    </svg>
                </div>
            )}

            {/* Topic details panel */}
            {selectedTopic && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                    {(() => {
                        const topic = topics.find(t => t.id === selectedTopic);
                        if (!topic) return null;

                        const status = getTopicStatus(topic);
                        const prereqsMet = arePrereqsMet(topic);
                        const progress = progressMap[topic.id] ?? null;

                        return (
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[var(--text)]">{topic.title}</h3>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTopic(null)}
                                        className="text-[var(--text)]/60 hover:text-[var(--text)]"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Status</h4>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: getNodeColor(topic) }}
                                            ></div>
                                            <span className="capitalize">{status.replace('-', ' ')}</span>
                                        </div>
                                        {progress && (
                                            <div className="mt-2">
                                                <p className="text-sm text-[var(--text)]/70">
                                                    Progress: {progress.completionPercentage}%
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-2">Category</h4>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: categoryColors[topic.category] }}
                                            ></div>
                                            <span>{categoryLabels[topic.category]}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleTopicClick(topic.id)}
                                    className="mt-4 px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    {status === 'completed' ? 'Review' : 'Start Learning'}
                                </button>

                                {!prereqsMet && (
                                    <p className="mt-4 text-sm text-[var(--text)]/70">
                                        Recommended: complete the prerequisite topics first for an easier time (you can still start this now).
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </motion.div>
            )}
        </div>
    );
}
