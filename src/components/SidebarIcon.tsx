'use client'

import { 
  Home, 
  Download, 
  Rocket, 
  Monitor, 
  Server, 
  Terminal, 
  ArrowRightLeft 
} from 'lucide-react';

const iconMap = {
  Home,
  Download,
  Rocket,
  Monitor,
  Server,
  Terminal,
  ArrowRightLeft,
};

interface SidebarIconProps {
  icon?: string;
  className?: string;
}

export function SidebarIcon({ icon, className = "h-4 w-4" }: SidebarIconProps) {
  if (!icon) return null;
  
  const IconComponent = iconMap[icon as keyof typeof iconMap];
  return IconComponent ? <IconComponent className={className} /> : null;
}
