"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "../lib/navigation";
import { NavIcon } from "./nav-icon";
import { cn } from "../../../lib/utils";

function Badge({ item }: { item: NavItem }) {
  if (!item.badge) {
    return null;
  }
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs",
        item.badgeVariant === "alert"
          ? "bg-red-100 font-semibold text-red-700"
          : "bg-slate-100 text-slate-500",
      )}
    >
      {item.badge}
    </span>
  );
}

export function SidebarNavigation({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Sidebar navigation" className="space-y-1">
      {items.map((item) => {
        const isActive = item.href ? pathname === item.href : false;
        if (!item.href || item.disabled) {
          return (
            <span
              aria-disabled="true"
              className="flex w-full cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400"
              key={item.label}
            >
              <NavIcon className="h-4 w-4" name={item.iconName} />
              <span className="flex-1">{item.label}</span>
              <Badge item={item} />
            </span>
          );
        }
        return (
          <Link
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
            href={item.href}
            key={item.label}
          >
            <NavIcon className="h-4 w-4" name={item.iconName} />
            <span className="flex-1">{item.label}</span>
            <Badge item={item} />
          </Link>
        );
      })}
    </nav>
  );
}
