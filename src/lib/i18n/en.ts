export const en = {
  // Navigation
  "nav.dashboard": "Dashboard",
  "nav.houses": "Houses",
  "nav.members": "Members",
  "nav.collectors": "Collectors",
  "nav.funds": "Funds",
  "nav.pay": "Pay",
  "nav.receipts": "Receipts",
  "nav.verifyKpay": "Verify KPay",
  "nav.cash": "Cash",
  "nav.disputes": "Disputes",
  "nav.settings": "Settings",
  "nav.logout": "Log out",
  "nav.platformAudit": "Platform Audit",
  "nav.villages": "Villages",
  "nav.auditLog": "Audit Log",

  // Shell
  "shell.platformAdmin": "Platform Admin",
  "shell.villageFundCollection": "Village Fund Collection",
  "shell.membership": "Membership",
  "shell.villageId": "Village ID",
  "shell.pendingBanner":
    "Your household membership is pending approval. Some village features are unavailable until the Head of House approves your membership.",
  "shell.pendingTitle": "Membership pending approval",
  "shell.skipToContent": "Skip to main content",
  "shell.mainNavigation": "Main navigation",
  "shell.menu": "Menu",
  "shell.closeMenu": "Close menu",
  "shell.account": "Account",
  "shell.unavailable": "Not available yet",
  "shell.hasAlerts": "Needs attention",
  "shell.role.systemAdmin": "System Admin",
  "shell.role.chief": "Chief",
  "shell.role.villager": "Villager",
  "shell.membership.active": "Active",
  "shell.membership.pending": "Pending",
  "shell.membership.rejected": "Rejected",
  "shell.membership.removed": "Removed",
  "shell.attention.title": "Needs Attention",
  "shell.attention.view": "View",
  "shell.attention.disputesOne": "{count} dispute awaiting review",
  "shell.attention.disputesOther": "{count} disputes awaiting review",
  "shell.attention.noCollector":
    "No active Collector assigned for the current period",
  "shell.attention.noFund": "No active Fund — payments cannot be collected",
  "shell.attention.kpayOne": "{count} KPay payment pending verification",
  "shell.attention.kpayOther": "{count} KPay payments pending verification",
  "shell.attention.rejectedOne":
    "{count} rejected payment — resubmit or dispute",
  "shell.attention.rejectedOther":
    "{count} rejected payments — resubmit or dispute",
  "shell.attention.membersOne": "{count} pending membership request",
  "shell.attention.membersOther": "{count} pending membership requests",
  "shell.chief.title": "Village Chief",
  "shell.chief.name": "Name",
  "shell.chief.phone": "Phone",
  "shell.chief.call": "Call Chief",
  "shell.comingSoon": "Coming soon",
  "shell.soon": "Soon",

  // Settings page
  "settings.title": "Settings",
  "settings.subtitle": "Manage your account, security, and preferences.",
  "settings.backToDashboard": "Back to dashboard",
  "settings.accountInfo": "Account information",
  "settings.role": "Role",
  "settings.village": "Village",
  "settings.house": "House",
  "settings.membershipStatus": "Membership",
  "settings.readOnlyNote":
    "Role, Village, House, and Membership are managed by village administrators and cannot be edited here.",
  "settings.editProfile": "Edit profile",
  "settings.changePassword": "Change password",
  "settings.preferences": "Preferences",
  "settings.appearance": "Appearance",
  "settings.language": "Language",
  "settings.saveSettings": "Save settings",
  "settings.saving": "Saving...",
  "settings.membership": "Membership",
  "settings.accountNote":
    "Role, Village, House, and Membership are managed by village administrators and cannot be edited here.",

  // Profile form
  "profile.name": "Name",
  "profile.email": "Email",
  "profile.phone": "Phone",
  "profile.saveProfile": "Save profile",
  "profile.saving": "Saving...",
  "profile.identifierError":
    "Provide at least one login identifier: email or phone.",

  // Password form
  "password.current": "Current password",
  "password.new": "New password",
  "password.confirm": "Confirm new password",
  "password.change": "Change password",
  "password.changing": "Changing password...",
  "password.hint": "Must be between 8 and 72 characters.",
  "password.success": "Password changed successfully.",

  // Theme options
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.system": "System",

  // Language options
  "language.en": "English",
  "language.my": "Myanmar (မြန်မာ)",

  // Common
  "common.loading": "Loading...",
  "common.error": "Something went wrong. Please try again.",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.back": "Back",
} as const;

export type TranslationKey = keyof typeof en;
