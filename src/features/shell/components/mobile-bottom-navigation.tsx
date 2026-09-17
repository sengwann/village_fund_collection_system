"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "../lib/navigation";
import { NavIcon } from "./nav-icon";

function MobileBadge({ item }: { item: NavItem }) {
  if (!item.badge || item.badgeVariant !== "alert") {
    return null;
  }
  return (
    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
      {item.badge}
    </span>
  );
}

export function MobileBottomNavigation({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden"
    >
      <div className="flex items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          if (!item.href || item.disabled) {
            return (
              <span
                aria-disabled="true"
                className="flex flex-1 flex-col items-center gap-1 px-2 py-2 text-xs text-slate-400"
                key={item.label}
              >
                <NavIcon className="h-5 w-5" name={item.iconName} />
                {item.label}
              </span>
            );
          }
          return (
            <Link
              className={`flex flex-1 flex-col items-center gap-1 px-2 py-2 text-xs transition ${
                isActive
                  ? "font-medium text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              href={item.href}
              key={item.label}
            >
              <span className="relative">
                <NavIcon className="h-5 w-5" name={item.iconName} />
                <MobileBadge item={item} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
