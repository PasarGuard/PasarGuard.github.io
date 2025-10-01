'use client'

import * as Icons from 'lucide-react';

interface SidebarIconProps {
  icon?: string;
  className?: string;
}

export function SidebarIcon({ icon, className = "h-4 w-4" }: SidebarIconProps) {
  if (!icon) return null;
  
  // Dynamically get the icon component from lucide-react
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  
  // Return the icon if it exists, otherwise return null
  return IconComponent ? <IconComponent className={className} /> : null;
}
