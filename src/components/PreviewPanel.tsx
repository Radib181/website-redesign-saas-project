import { Lock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreviewPanelProps {
  htmlCode: string;
  isLocked: boolean;
}

export function PreviewPanel({ htmlCode, isLocked }: PreviewPanelProps) {
  return (
    <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border/50">
      {/* Preview Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Live Preview</span>
        </div>
        {isLocked && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Waiting for code completion...</span>
          </div>
        )}
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative overflow-hidden bg-background/50">
        {isLocked ? (
          <>
            {/* Blurred placeholder */}
            <div className="absolute inset-0 blur-locked">
              <div className="p-8 space-y-4">
                <div className="h-12 w-48 rounded-lg bg-secondary animate-pulse" />
                <div className="h-6 w-96 rounded bg-secondary animate-pulse" />
                <div className="h-6 w-80 rounded bg-secondary animate-pulse" />
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 rounded-xl bg-secondary animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Lock overlay */}
            <div className="locked-overlay">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/80 flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Preview Locked</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  The preview will unlock once the AI finishes generating the code.
                </p>
              </div>
            </div>
          </>
        ) : (
          <iframe
            srcDoc={htmlCode}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
            title="Preview"
          />
        )}
      </div>
    </div>
  );
}
