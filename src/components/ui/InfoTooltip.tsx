import { Info } from 'lucide-react';
import React from 'react';

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function InfoTooltip({ content, className = 'ml-2', iconClassName = 'w-4 h-4' }: InfoTooltipProps) {
  return (
    <div className={`group relative inline-flex items-center justify-center align-middle ${className}`}>
      <Info className={`text-text-muted/50 hover:text-text-muted transition-colors cursor-help ${iconClassName}`} />
      
      {/* Tooltip Popover */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] z-50 hidden w-max max-w-[260px] sm:max-w-xs group-hover:block animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-xl border border-border-subtle/60 bg-bg-elevated/95 p-3 text-[13px] font-medium leading-relaxed text-text whitespace-normal text-center shadow-xl backdrop-blur-xl ring-1 ring-black/5">
          {content}
        </div>
        {/* Triangle Pointer */}
        <div className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-border-subtle/60 bg-bg-elevated/95" />
      </div>
    </div>
  );
}
