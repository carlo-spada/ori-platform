'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Section } from '@/components/ui/Section'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { Button } from '@/components/ui/button'
import { setDocumentMeta } from '@/lib/seo'
import { type BlogPost } from '@/lib/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Mock data - in a real app, this would come from a CMS or API
const mockPosts: BlogPost[] = [
  {
    slug: 'future-of-work-ai-human-collaboration',
    title: 'The Future of Work: AI and Human Collaboration',
    excerpt:
      'Exploring how artificial intelligence is reshaping the workplace and creating new opportunities for meaningful human contribution.',
    content: '<p>Full article content would go here...</p>',
    author: 'Ori AI',
    date: '2025-01-15T10:00:00Z',
    readingTimeMinutes: 8,
    category: 'Future of Work',
    tags: ['AI', 'Technology', 'Career'],
    featureImageUrl:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop',
  },
  {
    slug: 'building-adaptive-career-pathways',
    title: 'Building Adaptive Career Pathways in a Changing World',
    excerpt:
      'How to navigate career transitions and build resilience in an ever-evolving job market.',
    content: '<p>Full article content would go here...</p>',
    author: 'Ori AI',
    date: '2025-01-10T10:00:00Z',
    readingTimeMinutes: 6,
    category: 'Career Development',
    tags: ['Career', 'Growth', 'Skills'],
    featureImageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=675&fit=crop',
  },
  {
    slug: 'empathy-in-technology-design',
    title: 'Empathy in Technology Design',
    excerpt:
      'Why empathy-first design principles are essential for building technology that truly serves people.',
    content: '<p>Full article content would go here...</p>',
    author: 'Ori AI',
    date: '2025-01-05T10:00:00Z',
    readingTimeMinutes: 7,
    category: 'Technology',
    tags: ['Design', 'Empathy', 'UX'],
    featureImageUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=675&fit=crop',
  },
]

const POSTS_PER_PAGE = 9

export default function BlogIndexPage() {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)

  // Set SEO metadata
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDocumentMeta({
        title: t('blogPage.title'),
        description: t('blogPage.description'),
        canonical: `${window.location.origin}/blog`,
      })
    }
  }, [t])

  // Pagination logic
  const totalPages = Math.ceil(mockPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = mockPosts.slice(startIndex, endIndex)

  // Featured post is the first post
  const featuredPost = mockPosts[0]
  const remainingPosts = currentPosts.slice(1)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <PublicLayout>
      {/* Page Header */}
      <Section data-testid="blog-header" className="text-center">
        <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
          {t('blogPage.index.header.title')}
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
          {t('blogPage.index.header.subheadline')}
        </p>
      </Section>

      {/* Featured Post */}
      {currentPage === 1 && featuredPost && (
        <Section data-testid="featured-post">
          <BlogPostCard post={featuredPost} variant="featured" />
        </Section>
      )}

      {/* Post Grid */}
      <Section data-testid="blog-list">
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          data-testid="blog-grid"
        >
          {(currentPage === 1 ? remainingPosts : currentPosts).map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>

      {/* Pagination */}
      {totalPages > 1 && (
        <Section data-testid="blog-pagination" className="text-center">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              aria-label={t('blogPage.index.pagination.previous')}
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              {t('blogPage.index.pagination.previous')}
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="lg"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              aria-label={t('blogPage.index.pagination.next')}
            >
              {t('blogPage.index.pagination.next')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Section>
      )}
    </PublicLayout>
  )
}
