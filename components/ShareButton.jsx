'use client'

import { useState } from 'react';

const ShareButton = ({ postId, title }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Computed lazily (click time) so server HTML and client render match
  const getPostUrl = () => `${window.location.origin}/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getPostUrl());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform) => {
    const postUrl = getPostUrl();
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(title);
    const shareLinks = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };
    if (platform === 'instagram') {
      handleCopyLink();
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="share-btn"
        title="Share this post"
        aria-label="Share this post"
        aria-expanded={showShareMenu}
      >
        <svg
          width="18" height="18"
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
        <div className="share-menu">
          <button
            onClick={() => handleShare('twitter')}
          >
            Share on Twitter
          </button>
          <button
            onClick={() => handleShare('facebook')}
          >
            Share on Facebook
          </button>
          <button
            onClick={() => handleShare('instagram')}
          >
            Copy for Instagram
          </button>
          <button
            onClick={handleCopyLink}
          >
            {copySuccess ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;