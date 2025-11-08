import { useState, useRef, useEffect, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Send, Sparkles, User } from 'lucide-react'
import { ChatMessage } from '@/lib/navConfig'
import { cn } from '@/lib/utils'

export interface ChatWindowProps {
  messages: ChatMessage[]
  onSend?: (message: string) => void
  isLoading?: boolean
}

export function ChatWindow({
  messages,
  onSend,
  isLoading = false,
}: ChatWindowProps) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()

    if (trimmedInput && onSend) {
      onSend(trimmedInput)
      setInput('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <section
      className="border-border/50 from-card/80 via-card/60 to-card/80 relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-br shadow-xl backdrop-blur-md"
      aria-label="Conversation with Ori"
      data-testid="chat-window"
    >
      {/* Subtle glow effect */}
      <div className="from-primary/5 to-accent/5 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent" />

      <header className="border-border/50 relative z-10 shrink-0 border-b px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <div className="from-primary/20 to-accent/20 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
            <Sparkles className="text-primary h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="text-foreground text-lg font-semibold">
            {t('dashboardPage.chat.title')}
          </h2>
        </div>
      </header>

      <div className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full"></div>
                <div className="from-primary/30 to-accent/30 relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br backdrop-blur-sm">
                  <Sparkles className="text-primary h-5 w-5 animate-pulse" />
                </div>
              </div>
              <p className="text-muted-foreground animate-pulse text-sm">
                Loading conversation...
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-in fade-in max-w-sm space-y-3 text-center duration-500">
              <div className="from-primary/10 to-accent/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br">
                <Sparkles className="text-primary/60 h-8 w-8" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
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
                  'animate-in fade-in slide-in-from-bottom-2 flex gap-3 duration-300',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                {/* Assistant Avatar */}
                {message.role === 'assistant' && (
                  <div className="border-border/30 from-primary/20 to-accent/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-gradient-to-br backdrop-blur-sm">
                    <Sparkles
                      className="text-primary h-4 w-4"
                      aria-hidden="true"
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%]',
                    message.role === 'user'
                      ? 'from-accent to-accent/90 text-accent-foreground bg-gradient-to-br backdrop-blur-sm'
                      : 'border-border/50 from-muted/60 via-muted/40 to-muted/60 text-foreground border bg-gradient-to-br backdrop-blur-md',
                  )}
                >
                  <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <time className="mt-1.5 block text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>

                {/* User Avatar */}
                {message.role === 'user' && (
                  <div className="border-accent/30 from-accent/30 to-accent/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-gradient-to-br backdrop-blur-sm">
                    <User
                      className="text-accent-foreground h-4 w-4"
                      aria-hidden="true"
                    />
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
        className="border-border/50 bg-card/50 relative z-10 flex shrink-0 items-end gap-2 border-t px-4 py-3 backdrop-blur-sm sm:px-6"
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
          className="border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background/80 focus:ring-primary/50 max-h-[120px] min-h-[40px] flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:outline-none"
          aria-label="Message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t('dashboardPage.chat.sendLabel')}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </section>
  )
}
