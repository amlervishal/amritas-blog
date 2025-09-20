/**
 * Utility functions for generating meta information for blog posts
 */

/**
 * Generate a meta description from blog post content
 * @param {string} content - The HTML content of the blog post
 * @param {number} maxLength - Maximum length of the description (default: 160)
 * @returns {string} - Clean meta description
 */
export const generateMetaDescription = (content, maxLength = 160) => {
  if (!content) return '';

  // Strip HTML tags
  const tempElement = document.createElement('div');
  tempElement.innerHTML = content;
  const textContent = tempElement.textContent || tempElement.innerText || '';

  // Clean up whitespace and newlines
  const cleanText = textContent
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate to maxLength and add ellipsis if needed
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // Find the last complete word within the limit
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }

  return truncated + '...';
};

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The blog post title
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (title) => {
  if (!title) return '';

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Extract keywords from content for meta keywords
 * @param {string} content - The HTML content of the blog post
 * @param {number} maxKeywords - Maximum number of keywords to return
 * @returns {string} - Comma-separated keywords
 */
export const generateKeywords = (content, maxKeywords = 10) => {
  if (!content) return '';

  // Strip HTML tags
  const tempElement = document.createElement('div');
  tempElement.innerHTML = content;
  const textContent = tempElement.textContent || tempElement.innerText || '';

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'among', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
    'this', 'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our',
    'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it',
    'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves'
  ]);

  // Extract words, filter, and count frequency
  const words = textContent
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  const sortedWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);

  return sortedWords.join(', ');
};

/**
 * Generate complete meta tags object for a blog post
 * @param {object} post - The blog post object
 * @returns {object} - Meta tags object
 */
export const getMetaTags = (post) => {
  if (!post) return {};

  const title = post.metaTitle || post.title || 'Pin Drop Silence';
  const description = post.metaDescription || generateMetaDescription(post.content) || 'Blogs by Dr. Amrita Vohra';
  const image = post.metaImage || post.imageUrl || '/default-image.jpg';
  const keywords = generateKeywords(post.content);

  return {
    title,
    description,
    image,
    keywords,
    url: typeof window !== 'undefined' ? window.location.href : '',
    type: 'article',
    author: 'Dr. Amrita Vohra',
    siteName: 'Pin Drop Silence'
  };
};