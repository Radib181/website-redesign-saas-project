import { useState } from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GlowingInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function GlowingInput({ onSubmit, isLoading }: GlowingInputProps) {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className={cn(
        "relative rounded-2xl transition-all duration-500",
        isFocused && "animate-pulse-glow"
      )}>
        {/* Glow Effect */}
        <div className={cn(
          "absolute -inset-1 rounded-2xl bg-gradient-neon opacity-0 blur-xl transition-opacity duration-500",
          isFocused && "opacity-30"
        )} />
        
        {/* Input Container */}
        <div className="relative glass-card p-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 flex-1 px-4 py-3">
              <Globe className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="https://example.com/old-landing"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              variant="neon"
              size="lg"
              disabled={!url.trim() || isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Redesign this site</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        We'll scrape with Scraper → send to your n8n webhooks.
      </p>
    </form>
  );
}
