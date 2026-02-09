'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPost } from '../services/api';
import Comments from './Comments';
import { getMetaTags, generateMetaDescription } from '../utils/metaUtils';
import ShareButton from './ShareButton';

const BlogPreview = ({ user, id }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('No post ID provided');
        return;
      }
      try {
        const fetchedPost = await getPost(id);
        setPost(fetchedPost);
      } catch (err) {
        setError('Failed to fetch post');
        // console.error('Error fetching post:', err);
      }
    };
    fetchPost();
  }, [id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  const metaTags = getMetaTags(post);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Clean MSO/Word styles and comments from pasted content
  const cleanMsoContent = (html) => {
    let cleaned = html;
    // Remove MSO conditional comments (<!--[if gte mso 9]>...<![endif]-->)
    cleaned = cleaned.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
    // Remove HTML comments (including MSO style definitions)
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
    // Remove <style> blocks and their contents
    cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
    // Remove <meta>, <link>, and <xml> tags from Word
    cleaned = cleaned.replace(/<meta[^>]*>/gi, '');
    cleaned = cleaned.replace(/<link[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/?xml[^>]*>/gi, '');
    // Remove Office namespace tags like <o:p>, <w:sdt>, etc.
    cleaned = cleaned.replace(/<\/?\w+:[^>]*>/gi, '');
    // Remove mso-* inline style properties
    cleaned = cleaned.replace(/mso-[^;:"']+:[^;:"']+;?/gi, '');
    // Remove font-family and font-size inline styles (Word overrides default fonts)
    cleaned = cleaned.replace(/font-family:[^;:"']+;?/gi, '');
    cleaned = cleaned.replace(/font-size:[^;:"']+;?/gi, '');
    // Remove class="Mso*" attributes
    cleaned = cleaned.replace(/\s*class="Mso[^"]*"/gi, '');
    // Remove empty style attributes left after mso cleanup
    cleaned = cleaned.replace(/\s*style="\s*"/gi, '');
    // Remove Word-specific lang attributes
    cleaned = cleaned.replace(/\s*lang="[^"]*"/gi, '');
    // Remove empty <span> wrappers (Word adds many of these)
    cleaned = cleaned.replace(/<span\s*>([\s\S]*?)<\/span>/gi, '$1');
    // Collapse multiple <br> into paragraph breaks
    cleaned = cleaned.replace(/(<br\s*\/?\s*>){2,}/gi, '</p><p>');
    // Remove &nbsp; used as spacing (replace with regular space)
    cleaned = cleaned.replace(/&nbsp;/gi, ' ');
    // Clean up empty paragraphs
    cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');
    return cleaned;
  };
  const processedContent = cleanMsoContent(post.content || '');

  return (
    <div className="container flex flex-col content-center items-center px-4">
  
      <div className='md:mx-0 lg:mx-60'>
        <img
          src={post.imageUrl || "/default-image.png"}
          alt={post.title}
          className="w-full lg:h-96 object-cover mb-4 rounded-lg brightness-90"
        />
        <div className='flex flex-col md:px-0 lg:px-5'>
          <h1 className="font-Logo text-3xl font-light leading-relaxed mb-3">{post.title}</h1>
          <div className="flex items-center justify-between mb-3">
            <p className='font-Primary text-xs'>{post.createdAt?.toDate().toLocaleDateString()}</p>
            <ShareButton
              postId={id}
              title={post.title}
              description={metaTags.description}
              imageUrl={post.imageUrl}
            />
          </div>
        </div>
      </div>

      <div className='md:mx-0 lg:mx-60 md:px-0 lg:px-5'>
        <div
          className="mb-8 font-Primary prose max-w-none [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:text-lg"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
        <Comments postId={id} user={user} />
        <div className="flex flex-col justify-between items-center gap-2">
          <Link href="/" className="text-slate-700 text-xs font-Primary border-solid border rounded-full border-slate-600 hover:border-rose-500 tracking-widest hover:text-rose-500 md:text-base px-5 py-0">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;