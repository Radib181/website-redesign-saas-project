import { Code2 } from 'lucide-react';

interface HeaderProps {
  showStatus?: boolean;
}

export function Header({ showStatus = true }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center">
            <Code2 className="w-5 h-5 text-foreground" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-neon blur-lg opacity-50" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Weby · <span className="text-gradient">AI Re-Designer</span>
          </h1>
          <p className="text-xs text-muted-foreground">Scrape · Rebuild · Refine</p>
        </div>
      </div>
      
      {showStatus && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
          <span className="status-dot status-dot-connected" />
          <span className="text-sm text-muted-foreground">
            Workflow: <span className="text-emerald-400">Connected to n8n</span>
          </span>
        </div>
      )}
    </header>
  );
}
