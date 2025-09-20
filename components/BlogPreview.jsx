'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPost } from '../services/api';
import Comments from './Comments';
import { Helmet } from 'react-helmet-async';
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

  // Remove duplicate title from content
  const processedContent = post.content ? post.content.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, '') : '';

  return (
    <div className="container flex flex-col content-center items-center px-4">
      <Helmet>
        <title>{post.title} | Pin Drop Silence</title>
        <meta name="description" content={metaTags.description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:image" content={post.imageUrl || metaTags.image} />
        <meta property="og:site_name" content="Pin Drop Silence" />
        <meta property="article:author" content="Dr. Amrita Vohra" />
        <meta property="article:published_time" content={post.createdAt?.toDate()?.toISOString()} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={currentUrl} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaTags.description} />
        <meta name="twitter:image" content={post.imageUrl || metaTags.image} />

        {/* Additional SEO */}
        <meta name="keywords" content={metaTags.keywords} />
        <meta name="author" content="Dr. Amrita Vohra" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>
  
      <div className='md:mx-0 lg:mx-60'>
        <img
          src={post.imageUrl || "/default-image.png"}
          alt={post.title}
          className="w-full object-cover mb-4 rounded-lg brightness-90"
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

      <div
        className="mb-8 md:mx-0 lg:mx-60 md:px-0 lg:px-5 font-Primary prose max-w-none [&>p:first-child]:first-letter:font-bold [&>p:first-child]:first-letter:text-lg"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
      <Comments postId={id} user={user} />
      <div className="flex flex-col justify-between items-center px-5 gap-2">
        <Link href="/" className="text-slate-700 text-xs font-Primary border-solid border rounded-full border-slate-600 hover:border-rose-500 tracking-widest hover:text-rose-500 md:text-base px-5 py-0">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BlogPreview;