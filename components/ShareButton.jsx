'use client'

import { useState } from 'react';

const ShareButton = ({ postId, title, description, imageUrl }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const postUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/post/${postId}`;
  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    instagram: postUrl // Instagram doesn't support direct URL sharing, so we'll copy the link
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform) => {
    if (platform === 'instagram') {
      handleCopyLink();
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="text-rose-600 hover:text-rose-700 transition-colors p-2 rounded-full hover:bg-rose-50"
        title="Share this post"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16,6 12,2 8,6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      </button>

      {showShareMenu && (
        <div className="absolute top-6 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-40">
          <button
            onClick={() => handleShare('twitter')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Share on Twitter
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Share on Facebook
          </button>
          <button
            onClick={() => handleShare('instagram')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Copy for Instagram
          </button>
          <button
            onClick={handleCopyLink}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {copySuccess ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;