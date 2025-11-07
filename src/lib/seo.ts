/**
 * SEO Helpers
 * Utilities for setting document meta tags, OpenGraph, Twitter cards, and JSON-LD structured data.
 */

export interface SEOConfig {
  title: string;
  description: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
}

/**
 * Set document title and meta description
 */
export function setDocumentMeta(config: SEOConfig): void {
  // Title
  document.title = config.title;

  // Description
  setMetaTag('name', 'description', config.description);

  // OpenGraph
  setMetaTag('property', 'og:title', config.title);
  setMetaTag('property', 'og:description', config.description);
  setMetaTag('property', 'og:type', config.ogType || 'website');
  if (config.ogImage) {
    setMetaTag('property', 'og:image', config.ogImage);
  }

  // Twitter
  setMetaTag('name', 'twitter:card', config.twitterCard || 'summary_large_image');
  setMetaTag('name', 'twitter:title', config.title);
  setMetaTag('name', 'twitter:description', config.description);
  if (config.ogImage) {
    setMetaTag('name', 'twitter:image', config.ogImage);
  }

  // Canonical
  if (config.canonical) {
    setLinkTag('canonical', config.canonical);
  }
}

/**
 * Set or update a meta tag
 */
function setMetaTag(
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string
): void {
  let metaTag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', content);
}

/**
 * Set or update a link tag
 */
function setLinkTag(rel: string, href: string): void {
  let linkTag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!linkTag) {
    linkTag = document.createElement('link');
    linkTag.setAttribute('rel', rel);
    document.head.appendChild(linkTag);
  }
  linkTag.href = href;
}

/**
 * Inject JSON-LD structured data
 */
export function setJSONLD(data: Record<string, unknown>): void {
  // Remove existing script if present
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
