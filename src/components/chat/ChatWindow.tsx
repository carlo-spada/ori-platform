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
      className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/80 shadow-xl backdrop-blur-md"
      aria-label="Conversation with Ori"
      data-testid="chat-window"
    >
      {/* Subtle glow effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <header className="relative z-10 shrink-0 border-b border-border/50 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {t('dashboardPage.chat.title')}
          </h2>
        </div>
      </header>

      <div className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 animate-pulse text-primary" />
                </div>
              </div>
              <p className="animate-pulse text-sm text-muted-foreground">
                Loading conversation...
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm space-y-3 text-center duration-500 animate-in fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
                <Sparkles className="h-8 w-8 text-primary/60" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
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
                  'flex gap-3 duration-300 animate-in fade-in slide-in-from-bottom-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                )}
              >
                {/* Assistant Avatar */}
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/30 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm">
                    <Sparkles
                      className="h-4 w-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[75%]',
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-accent to-accent/90 text-accent-foreground backdrop-blur-sm'
                      : 'border border-border/50 bg-gradient-to-br from-muted/60 via-muted/40 to-muted/60 text-foreground backdrop-blur-md',
                  )}
                >
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-gradient-to-br from-accent/30 to-accent/20 backdrop-blur-sm">
                    <User
                      className="h-4 w-4 text-accent-foreground"
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
        className="relative z-10 flex shrink-0 items-end gap-2 border-t border-border/50 bg-card/50 px-4 py-3 backdrop-blur-sm sm:px-6"
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
          className="max-h-[120px] min-h-[40px] flex-1 resize-none rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm text-foreground backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Message input"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm transition-all duration-200 hover:from-primary/90 hover:to-primary/70 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={t('dashboardPage.chat.sendLabel')}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </section>
  )
}
