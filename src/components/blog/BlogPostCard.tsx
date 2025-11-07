import { type ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { type BlogPost } from '@/lib/types';
import { Clock } from 'lucide-react';

export interface BlogPostCardProps extends ComponentPropsWithoutRef<'article'> {
  post: BlogPost;
  variant?: 'default' | 'featured';
}

export function BlogPostCard({
  post,
  variant = 'default',
  className,
  ...props
}: BlogPostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isFeatured = variant === 'featured';

  return (
    <article
      className={cn(
        'group relative rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-accent/50 hover:shadow-lg',
        isFeatured && 'md:col-span-2 lg:col-span-3',
        className
      )}
      {...props}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-xl"
        aria-label={`Read article: ${post.title}`}
      >
        {post.featureImageUrl && (
          <div
            className={cn(
              'relative aspect-[16/9] overflow-hidden bg-muted',
              isFeatured && 'md:aspect-[21/9]'
            )}
          >
            <Image
              src={post.featureImageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className={cn('p-6', isFeatured && 'md:p-8')}>
          {/* Category and Tags */}
          {post.category && (
            <div className="mb-3">
              <span className="inline-block text-xs font-medium text-primary uppercase tracking-wide">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h2
            className={cn(
              'font-bold text-foreground mb-3 group-hover:text-primary transition-colors',
              isFeatured
                ? 'text-2xl sm:text-3xl lg:text-4xl'
                : 'text-xl sm:text-2xl'
            )}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            className={cn(
              'text-muted-foreground mb-4 line-clamp-3',
              isFeatured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
            )}
          >
            {post.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.date}>{formattedDate}</time>
            <span aria-hidden="true">•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readingTimeMinutes} min read
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
