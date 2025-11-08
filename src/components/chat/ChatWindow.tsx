import { useState, useRef, useEffect, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
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
      className="h-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden"
      aria-label="Conversation with AURA"
      data-testid="chat-window"
    >
      <header className="px-4 sm:px-6 py-4 border-b border-border shrink-0">
        <h2 className="text-lg font-semibold text-foreground">{t('dashboardPage.chat.title')}</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {t('dashboardPage.chat.emptyStateMessage')}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted/50 text-foreground border border-border'
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <time className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border px-4 sm:px-6 py-3 flex items-end gap-2 shrink-0"
      >
        <label htmlFor="chat-input" className="sr-only">
          Message AURA
        </label>
        <textarea
          ref={inputRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('dashboardPage.chat.placeholder')}
          rows={1}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-xl bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
          aria-label="Message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="shrink-0 h-10 w-10 rounded-xl"
          aria-label={t('dashboardPage.chat.sendLabel')}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </section>
  );
}
