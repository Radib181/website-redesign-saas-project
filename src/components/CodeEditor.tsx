import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  isTyping: boolean;
  progress: number;
}

export function CodeEditor({ code, isTyping, progress }: CodeEditorProps) {
  const editorRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollTop = editorRef.current.scrollHeight;
    }
  }, [code]);

  const highlightCode = (code: string) => {
    return code
      .replace(/(&lt;!DOCTYPE.*?&gt;)/gi, '<span class="text-muted-foreground">$1</span>')
      .replace(/(&lt;\/?[a-z][a-z0-9]*)/gi, '<span class="text-neon-pink">$1</span>')
      .replace(/(&gt;)/g, '<span class="text-neon-pink">$1</span>')
      .replace(/(class|id|style|href|src|type|name|content|rel)=/gi, '<span class="text-neon-cyan">$1</span>=')
      .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(\/\*.*?\*\/)/gs, '<span class="text-muted-foreground">$1</span>')
      .replace(/(&lt;!--.*?--&gt;)/gs, '<span class="text-muted-foreground">$1</span>');
  };

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border/50">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-sm text-muted-foreground ml-3">index.html</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full bg-gradient-neon transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Line Numbers */}
          <div className="py-4 px-3 text-right border-r border-border/30 bg-secondary/20 select-none">
            {code.split('\n').map((_, i) => (
              <div key={i} className="text-xs text-muted-foreground/50 leading-6 font-mono">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <pre
            ref={editorRef}
            className="flex-1 p-4 overflow-auto font-mono text-sm leading-6"
          >
            <code 
              dangerouslySetInnerHTML={{ 
                __html: highlightCode(escapeHtml(code)) 
              }} 
            />
            {isTyping && <span className="typing-cursor" />}
          </pre>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border/50 bg-secondary/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>HTML</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln {code.split('\n').length}, Col {code.split('\n').pop()?.length || 0}</span>
          {isTyping && (
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              AI Writing...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
