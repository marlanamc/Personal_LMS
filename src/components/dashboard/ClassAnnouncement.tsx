'use client';

import React, { useState } from 'react';
import { Megaphone, ChevronDown, ChevronUp } from 'lucide-react';

interface ClassAnnouncementProps {
    announcements: {
        className: string;
        message: string;
        messageHtml: string;
    }[];
}

export const ClassAnnouncement: React.FC<ClassAnnouncementProps> = ({ announcements }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!announcements || announcements.length === 0) return null;

    return (
        <section className="animate-fade-in-up delay-75">
            <div className="relative overflow-hidden glass-card rounded-2xl p-4 sm:p-5 border border-primary/30 bg-gradient-to-br from-primary/20 to-secondary/20 shadow-md transition-all duration-300 max-w-4xl">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary shadow-inner">
                                <Megaphone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary/80 leading-none">
                                    Student Notice
                                </p>
                                <h2 className="text-base sm:text-lg font-bold font-display text-text mt-0.5">
                                    Teacher Announcements
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/20 text-primary transition-colors flex items-center gap-1 text-xs sm:text-sm font-semibold border border-primary/30 bg-bg-secondary/40"
                            aria-label={isCollapsed ? "Show announcements" : "Hide announcements"}
                        >
                            <span className="hidden sm:inline">{isCollapsed ? "Show" : "Hide"}</span>
                            {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                        </button>
                    </div>

                    {!isCollapsed && (
                        <div className="mt-4 space-y-4 animate-fade-in">
                            {announcements.map((announcement, index) => (
                                <div
                                    key={`${announcement.className}-${index}`}
                                    className="group relative animate-fade-in-up"
                                    style={{ animationDelay: `${(index + 1) * 150}ms` }}
                                >
                                    <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-secondary/60 border border-white/80 shadow-sm hover:shadow-md hover:bg-bg-secondary/90 transition-all duration-300">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="handwritten text-primary text-xs sm:text-sm font-bold bg-primary/5 px-2 py-0.5 rounded-md">
                                                    {announcement.className}
                                                </span>
                                                <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/15 to-transparent"></div>
                                            </div>
                                            <div
                                                className="text-sm sm:text-base text-text/90 announcement-markdown prose prose-sm max-w-prose"
                                                dangerouslySetInnerHTML={{ __html: announcement.messageHtml }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
