"use client";
import {
  Banknote,
  Building2,
  CreditCard,
  Home,
  Landmark,
  Receipt,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
  Settings,
  UserCircle,
  type LucideIcon,
} from "lucide-react";
import type { NavIconName } from "../lib/navigation";

const iconMap: Record<NavIconName, LucideIcon> = {
  home: Home,
  landmark: Landmark,
  "scroll-text": ScrollText,
  building: Building2,
  users: Users,
  "user-cog": UserCog,
  wallet: Wallet,
  "credit-card": CreditCard,
  receipt: Receipt,
  "shield-check": ShieldCheck,
  banknote: Banknote,
  "shield-alert": ShieldAlert,
  "user-circle": UserCircle,
  settings: Settings,
};

export function NavIcon({
  name,
  className,
}: {
  name: NavIconName;
  className?: string;
}) {
  const Icon = iconMap[name];
  return <Icon aria-hidden className={className} />;
}
