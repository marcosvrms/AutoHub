'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb — Trilha de navegação hierárquica do AutoHub
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Navegação hierárquica" className="flex items-center gap-1.5 flex-wrap">
      <Link
        href="/"
        aria-label="Página inicial"
        className="text-white/30 hover:text-[#00D4FF] transition-colors"
      >
        <Home size={13} />
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight size={12} className="text-white/20 shrink-0" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-xs text-white/40 hover:text-[#00D4FF] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`text-xs ${isLast ? 'text-white/80' : 'text-white/40'}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
