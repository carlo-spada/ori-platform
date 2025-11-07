'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PostLayout } from '@/components/blog/PostLayout';
import { setDocumentMeta, setJSONLD } from '@/lib/seo';
import { type BlogPost } from '@/lib/types';

// Mock data - in a real app, this would come from a CMS or API
const mockPosts: Record<string, BlogPost> = {
  'future-of-work-ai-human-collaboration': {
    slug: 'future-of-work-ai-human-collaboration',
    title: 'The Future of Work: AI and Human Collaboration',
    excerpt:
      'Exploring how artificial intelligence is reshaping the workplace and creating new opportunities for meaningful human contribution.',
    content: `
      <p>The relationship between artificial intelligence and human workers is evolving rapidly. Rather than replacing humans, AI is becoming a powerful collaborator that amplifies human capabilities and creates new opportunities for meaningful work.</p>

      <h2>The Shift from Replacement to Augmentation</h2>
      <p>Early fears about AI replacing human workers have given way to a more nuanced understanding. AI excels at processing vast amounts of data, identifying patterns, and handling repetitive tasks. Humans bring creativity, emotional intelligence, ethical judgment, and the ability to navigate complex social situations.</p>

      <p>The most successful organizations are those that recognize these complementary strengths and design workflows that leverage both.</p>

      <h2>New Roles, New Opportunities</h2>
      <p>As AI handles routine tasks, new roles are emerging that focus on:</p>
      <ul>
        <li><strong>AI Training and Oversight:</strong> Professionals who teach AI systems and monitor their outputs</li>
        <li><strong>Human-AI Interface Design:</strong> Specialists who create seamless interactions between people and AI tools</li>
        <li><strong>Ethical AI Governance:</strong> Roles focused on ensuring AI systems operate fairly and transparently</li>
        <li><strong>Creative Synthesis:</strong> Positions that combine AI-generated insights with human creativity</li>
      </ul>

      <h2>Building Skills for the AI Era</h2>
      <p>To thrive in this evolving landscape, workers should focus on developing skills that complement AI:</p>
      <ul>
        <li>Critical thinking and complex problem-solving</li>
        <li>Emotional intelligence and interpersonal skills</li>
        <li>Creativity and innovation</li>
        <li>Adaptability and continuous learning</li>
        <li>Ethical reasoning and judgment</li>
      </ul>

      <blockquote>
        "The future belongs not to those who fear AI, but to those who learn to dance with it."
      </blockquote>

      <h2>The Path Forward</h2>
      <p>At AURA, we believe the future of work is fundamentally human. AI should serve as an empathetic companion that helps people discover work that aligns with their unique strengths, passions, and values. Technology should empower individuals, not dictate their paths.</p>

      <p>The organizations and individuals who will thrive are those who embrace AI as a tool for human flourishing rather than a threat to human relevance.</p>
    `,
    author: 'AURA AI',
    date: '2025-01-15T10:00:00Z',
    readingTimeMinutes: 8,
    category: 'Future of Work',
    tags: ['AI', 'Technology', 'Career', 'Innovation'],
    featureImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop',
  },
  'building-adaptive-career-pathways': {
    slug: 'building-adaptive-career-pathways',
    title: 'Building Adaptive Career Pathways in a Changing World',
    excerpt:
      'How to navigate career transitions and build resilience in an ever-evolving job market.',
    content: `
      <p>The traditional career ladder has given way to a more dynamic, non-linear journey. Today's professionals must be prepared to pivot, adapt, and continuously evolve their skills and career paths.</p>

      <h2>The End of Linear Careers</h2>
      <p>Gone are the days when workers could expect to climb a single career ladder within one company or industry. Modern careers are characterized by frequent transitions, skill evolution, and the need to remain agile in the face of rapid technological and economic change.</p>

      <h2>Building Career Resilience</h2>
      <p>Career resilience is the ability to adapt to changes, overcome setbacks, and continue moving forward. Here's how to build it:</p>

      <h3>1. Embrace Continuous Learning</h3>
      <p>Commit to lifelong learning. Stay curious about emerging trends in your field and adjacent industries. Set aside regular time for skill development.</p>

      <h3>2. Diversify Your Skill Set</h3>
      <p>Don't put all your eggs in one basket. Develop a portfolio of complementary skills that can be applied across different roles and industries.</p>

      <h3>3. Build a Strong Network</h3>
      <p>Your professional network is one of your most valuable career assets. Cultivate relationships across industries and maintain connections even during stable periods.</p>

      <h3>4. Stay Self-Aware</h3>
      <p>Regularly assess your values, strengths, and career goals. What worked for you five years ago may not align with who you are today.</p>

      <h2>Navigating Transitions</h2>
      <p>Career transitions can be stressful, but they also offer opportunities for growth and reinvention. When facing a transition:</p>
      <ul>
        <li>Take time to reflect on what you truly want</li>
        <li>Research potential paths thoroughly</li>
        <li>Identify transferable skills</li>
        <li>Seek mentorship and guidance</li>
        <li>Start small with pilot projects or side work</li>
      </ul>

      <h2>How AURA Can Help</h2>
      <p>AURA is designed to be your companion throughout your career journey. We help you discover opportunities that align with your evolving self, suggest upskilling pathways, and support you through transitions with personalized guidance.</p>
    `,
    author: 'AURA AI',
    date: '2025-01-10T10:00:00Z',
    readingTimeMinutes: 6,
    category: 'Career Development',
    tags: ['Career', 'Growth', 'Skills', 'Resilience'],
    featureImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=675&fit=crop',
  },
  'empathy-in-technology-design': {
    slug: 'empathy-in-technology-design',
    title: 'Empathy in Technology Design',
    excerpt:
      'Why empathy-first design principles are essential for building technology that truly serves people.',
    content: `
      <p>Technology has the power to transform lives, but only when it's built with genuine empathy for the people it serves. Empathy-first design goes beyond usability—it means deeply understanding human needs, emotions, and contexts.</p>

      <h2>What is Empathy-First Design?</h2>
      <p>Empathy-first design is a philosophy that places human well-being at the center of the development process. It requires designers and developers to:</p>
      <ul>
        <li>Listen deeply to users' needs and pain points</li>
        <li>Consider diverse perspectives and experiences</li>
        <li>Design for inclusion and accessibility from the start</li>
        <li>Prioritize user autonomy and agency</li>
        <li>Build with transparency and trust</li>
      </ul>

      <h2>Beyond Usability</h2>
      <p>A product can be technically usable but still fail to serve its users well. Empathy-first design asks deeper questions:</p>
      <ul>
        <li>Does this technology respect users' time and attention?</li>
        <li>Does it empower or manipulate?</li>
        <li>Does it accommodate different abilities and contexts?</li>
        <li>Does it handle sensitive information with care?</li>
        <li>Does it contribute to user well-being or detract from it?</li>
      </ul>

      <h2>Designing AURA with Empathy</h2>
      <p>At AURA, empathy is not just a buzzword—it's fundamental to how we build. We recognize that job searching and career decisions are deeply personal and often stressful experiences. Our design principles reflect this:</p>

      <h3>Respect for Autonomy</h3>
      <p>AURA provides guidance and suggestions, but you always maintain control. We believe technology should empower decision-making, not make decisions for you.</p>

      <h3>Transparency</h3>
      <p>We explain how AURA learns and makes recommendations. No black boxes. You deserve to understand the technology that influences your career.</p>

      <h3>Patience and Adaptability</h3>
      <p>Career journeys are not linear. AURA is designed to support you through pivots, setbacks, and periods of uncertainty without judgment.</p>

      <h3>Privacy and Trust</h3>
      <p>Your career information is deeply personal. We handle your data with the highest standards of security and respect.</p>

      <h2>The Future of Empathetic Technology</h2>
      <p>As AI becomes more powerful, the need for empathy in design becomes more critical. We must ensure that technology serves human flourishing, not just efficiency or profit.</p>

      <blockquote>
        "Technology is at its best when it makes us more human, not less."
      </blockquote>
    `,
    author: 'AURA AI',
    date: '2025-01-05T10:00:00Z',
    readingTimeMinutes: 7,
    category: 'Technology',
    tags: ['Design', 'Empathy', 'UX', 'Ethics'],
    featureImageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=675&fit=crop',
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = slug ? mockPosts[slug] : null;

  useEffect(() => {
    if (post) {
      // Set SEO metadata
      setDocumentMeta({
        title: `${post.title} | AURA Insights`,
        description: post.excerpt,
        canonical: `${window.location.origin}/blog/${post.slug}`,
      });

      // Set JSON-LD structured data
      setJSONLD({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        author: {
          '@type': 'Organization',
          name: post.author,
        },
        datePublished: post.date,
        url: `${window.location.origin}/blog/${post.slug}`,
        ...(post.featureImageUrl && {
          image: post.featureImageUrl,
        }),
      });
    }
  }, [post]);

  // If post not found, redirect to blog index
  if (!post) {
    redirect('/blog');
  }

  return (
    <PublicLayout>
      <PostLayout post={post} />
    </PublicLayout>
  );
}