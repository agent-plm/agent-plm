export type NavItem = {
  href: string;
  label: string;
  description?: string;
};

export const mainNavigation: NavItem[] = [
  { href: "/", label: "Dashboard", description: "Overview" },
  { href: "/seasons", label: "Seasons", description: "Calendar seasons" },
];
