'use client';

import Link from 'next/link';
import { BriefcaseBusiness, FileText, FolderKanban, MessageSquare } from 'lucide-react';

export function WorkspaceToolsGrid() {
  const tools = [
    {
      name: 'Thought Download',
      description: 'Daily markdown brain dump',
      href: '/dashboard/thought-download',
      icon: FileText,
      color: 'from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Organize',
      description: 'Manage projects and bullets',
      href: '/dashboard/organize',
      icon: FolderKanban,
      color: 'from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Work Desk',
      description: 'Separate job projects and tasks',
      href: '/dashboard/work-desk',
      icon: BriefcaseBusiness,
      color: 'from-slate-500/10 to-sky-600/10 hover:from-slate-500/20 hover:to-sky-600/20',
      iconColor: 'text-sky-700',
    },
    {
      name: 'Moment Log',
      description: 'Quick timestamped entries',
      href: '/dashboard/interstitial-journalling',
      icon: MessageSquare,
      color: 'from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {tools.map((tool) => (
        <Link
          key={tool.name}
          href={tool.href}
          className={`block p-6 rounded-xl bg-gradient-to-br ${tool.color} border border-transparent hover:border-primary/20 transition-all group`}
        >
          <div className="space-y-3">
            <div className={`w-12 h-12 rounded-lg bg-white/80 ${tool.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <tool.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{tool.name}</h4>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
