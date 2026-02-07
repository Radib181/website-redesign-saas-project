import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturePillProps {
  icon: LucideIcon;
  text: string;
  className?: string;
}

export function FeaturePill({ icon: Icon, text, className }: FeaturePillProps) {
  return (
    <div className={cn(
      "feature-pill group cursor-default transition-all duration-300",
      className
    )}>
      <Icon className="w-4 h-4 text-neon-cyan group-hover:text-neon-purple transition-colors" />
      <span className="text-foreground/90">{text}</span>
    </div>
  );
}
