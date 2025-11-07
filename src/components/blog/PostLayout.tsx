import { type BlogPost } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export interface PostLayoutProps {
  post: BlogPost;
}

export function PostLayout({ post }: PostLayoutProps) {
  const { t } = useTranslation();
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
        <Link href="/blog" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('blogPage.post.backToBlogLabel')}
        </Link>
      </Button>

      <article>
        {/* Post Header */}
        <header className="mb-8">
          {post.category && (
            <div className="mb-4">
              <span className="inline-block text-sm font-medium text-primary uppercase tracking-wide">
                {post.category}
              </span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.date}>{formattedDate}</time>
            <span aria-hidden="true">•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readingTimeMinutes} min read
            </span>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Feature Image */}
        {post.featureImageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted mb-8">
            <Image
              src={post.featureImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              fill
              priority
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose prose-lg prose-slate dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
            prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
            prose-li:text-muted-foreground prose-li:mb-2
            prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Post Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <Button asChild variant="outline" size="lg">
          <Link href="/blog" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
            {t('blogPage.post.backToBlogLabel')}
          </Link>
        </Button>
      </footer>
    </div>
  );
}
