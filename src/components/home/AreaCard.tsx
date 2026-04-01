'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface AreaCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
  color: 'blue' | 'purple' | 'orange' | 'green';
}

const colorStyles = {
  blue: {
    gradient: 'from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20',
    iconColor: 'text-blue-600',
  },
  purple: {
    gradient: 'from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20',
    iconColor: 'text-purple-600',
  },
  orange: {
    gradient: 'from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20',
    iconColor: 'text-orange-600',
  },
  green: {
    gradient: 'from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20',
    iconColor: 'text-green-600',
  },
};

export function AreaCard({ title, icon: Icon, href, color }: AreaCardProps) {
  const styles = colorStyles[color];

  return (
    <Link
      href={href}
      className={`block p-6 rounded-xl bg-gradient-to-br ${styles.gradient} border border-transparent hover:border-primary/20 transition-all group`}
    >
      <div className="space-y-3">
        <div className={`w-12 h-12 rounded-lg bg-white/80 ${styles.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{title}</h4>
        </div>
      </div>
    </Link>
  );
}
