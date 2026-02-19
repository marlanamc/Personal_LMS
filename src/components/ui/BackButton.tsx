"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HomeIcon } from "@/components/icons/Icons";

const baseClass =
  "items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-light)] hover:border-[var(--color-border-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2";

interface BackButtonBaseProps {
  children?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  variant?: "back" | "home";
  hideOnMobile?: boolean;
}

interface BackButtonLinkProps extends BackButtonBaseProps {
  href: string;
  onClick?: never;
}

interface BackButtonButtonProps extends BackButtonBaseProps {
  href?: never;
  onClick: () => void;
}

export type BackButtonProps = BackButtonLinkProps | BackButtonButtonProps;

export function BackButton({
  href,
  onClick,
  children = "Back",
  className = "",
  variant = "back",
  hideOnMobile = false,
  "aria-label": ariaLabel,
}: BackButtonProps) {
  const isHome = variant === "home";

  // Keep display classes isolated so `hideOnMobile` cannot be overridden by utility order.
  const visibilityClass = hideOnMobile ? "hidden md:inline-flex" : "inline-flex";

  // Responsive classes:
  // - If home: circular on md+, standard on mobile
  // - If back: standard everywhere
  const buttonClasses = isHome
    ? [
        "items-center transition-colors shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
        "md:justify-center md:w-10 md:h-10 md:rounded-full md:bg-white md:border md:border-[var(--color-border)] md:text-[var(--color-text)] md:hover:bg-[var(--color-bg-light)] md:hover:border-[var(--color-border-dark)]", // Desktop (Home style)
        "rounded-lg bg-white border border-[var(--color-border)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-bg-light)] hover:border-[var(--color-border-dark)] gap-2 px-3 py-2 md:px-0 md:py-0", // Mobile (Standard style override)
      ].join(" ")
    : baseClass;

  const combinedClass = [visibilityClass, buttonClasses, className]
    .filter(Boolean)
    .join(" ");
  
  const defaultAria = isHome ? "Go to Dashboard" : "Go back";
  const finalAriaLabel = ariaLabel || defaultAria;

  const icon = isHome ? (
    <>
      <HomeIcon size={20} className="hidden md:block shrink-0" aria-hidden />
      <ArrowLeft className="block md:hidden w-4 h-4 shrink-0" aria-hidden />
    </>
  ) : (
    <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden />
  );

  const content = (
    <>
      {icon}
      {/* Show children if not home, or if home AND mobile */}
      {(!isHome || (isHome && children)) && (
        <span className={isHome ? "block md:hidden" : ""}>
          {isHome ? "Back" : children}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClass} aria-label={finalAriaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={combinedClass}
      aria-label={finalAriaLabel}
    >
      {content}
    </button>
  );
}
