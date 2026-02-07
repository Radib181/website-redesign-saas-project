import { useState, useRef, useEffect } from 'react';
import { Lock, Send, MessageSquare, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types/project';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLocked: boolean;
  isProcessing: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatPanel({ messages, isLocked, isProcessing, onSendMessage }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden border border-border/50">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Refinement Chat</span>
        </div>
        {isLocked && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>Unlock after design ready</span>
          </div>
        )}
      </div>

      {/* Chat Content */}
      <div className="flex-1 relative overflow-hidden">
        {isLocked ? (
          <div className="locked-overlay">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary/80 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Chat Locked</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Chat will unlock after the initial design is complete.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-neon/20 flex items-center justify-center mb-3">
                    <Bot className="w-6 h-6 text-neon-purple" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">Ready to refine</h4>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Describe any changes you'd like to make to the design.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-neon/20 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-neon-purple" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5",
                        msg.role === 'user'
                          ? "bg-gradient-neon text-foreground"
                          : "bg-secondary/80 text-foreground"
                      )}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isProcessing && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-neon/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-neon-purple" />
                  </div>
                  <div className="bg-secondary/80 rounded-2xl px-4 py-2.5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-neon-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-neon-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-neon-purple animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your refinement..."
                  className="flex-1 bg-secondary/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  variant="neon"
                  size="icon"
                  disabled={!input.trim() || isProcessing}
                  className="w-12 h-12"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
