import { useState, useRef, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, User } from 'lucide-react';
import { ChatMessage } from '@/lib/navConfig';
import { cn } from '@/lib/utils';

export interface ChatWindowProps {
  messages: ChatMessage[];
  onSend?: (message: string) => void;
  isLoading?: boolean;
}

export function ChatWindow({ messages, onSend, isLoading = false }: ChatWindowProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    
    if (trimmedInput && onSend) {
      onSend(trimmedInput);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <section
      className="h-full rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-md flex flex-col overflow-hidden relative shadow-xl"
      aria-label="Conversation with Ori"
      data-testid="chat-window"
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <header className="px-4 sm:px-6 py-4 border-b border-border/50 shrink-0 relative z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">{t('dashboardPage.chat.title')}</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground animate-pulse">Loading conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-sm space-y-3 animate-in fade-in duration-500">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary/60" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('dashboardPage.chat.emptyStateMessage')}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {/* Assistant Avatar */}
                {message.role === 'assistant' && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm border border-border/30">
                    <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-accent to-accent/90 text-accent-foreground backdrop-blur-sm'
                      : 'bg-gradient-to-br from-muted/60 via-muted/40 to-muted/60 text-foreground border border-border/50 backdrop-blur-md'
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <time className="text-xs opacity-70 mt-1.5 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>

                {/* User Avatar */}
                {message.role === 'user' && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/20 flex items-center justify-center backdrop-blur-sm border border-accent/30">
                    <User className="w-4 h-4 text-accent-foreground" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border/50 px-4 sm:px-6 py-3 flex items-end gap-2 shrink-0 relative z-10 backdrop-blur-sm bg-card/50"
      >
        <label htmlFor="chat-input" className="sr-only">
          Message Ori
        </label>
        <textarea
          ref={inputRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('dashboardPage.chat.placeholder')}
          rows={1}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-xl bg-background/50 border border-border/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 backdrop-blur-sm"
          aria-label="Message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          aria-label={t('dashboardPage.chat.sendLabel')}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </section>
  );
}
