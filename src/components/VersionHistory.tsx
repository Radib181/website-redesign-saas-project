import { History, Check } from 'lucide-react';
import { Version } from '@/types/project';
import { cn } from '@/lib/utils';

interface VersionHistoryProps {
  versions: Version[];
  currentVersionId: string;
  onSelectVersion: (versionId: string) => void;
}

export function VersionHistory({ versions, currentVersionId, onSelectVersion }: VersionHistoryProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-neon-cyan" />
        <h3 className="text-sm font-medium text-foreground">Version History</h3>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {versions.map((version) => (
          <button
            key={version.id}
            onClick={() => onSelectVersion(version.id)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
              version.id === currentVersionId
                ? "bg-primary/20 border border-primary/30"
                : "bg-secondary/50 hover:bg-secondary/80 border border-transparent"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">v{version.number}</span>
              {version.isComplete && (
                <Check className="w-3 h-3 text-emerald-400" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(version.createdAt).toLocaleTimeString()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
