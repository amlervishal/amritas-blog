'use client'

import { useState, useEffect } from 'react';
import { getLatestComments, getPosts } from '../services/api';

const CommentsSlider = () => {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestComments, allPosts] = await Promise.all([
          getLatestComments(5),
          getPosts()
        ]);

        setComments(latestComments);
        setPosts(allPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (comments.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === comments.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [comments.length]);

  const getPostTitle = (postId) => {
    const post = posts.find(p => p.id === postId);
    return post?.title || 'Unknown Post';
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? comments.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === comments.length - 1 ? 0 : currentIndex + 1);
  };

  if (loading) {
    return (
      <div className="mb-8 flex justify-center">
        <div className="max-w-2xl bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 px-4 py-3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:4px_4px]">
          <p className="text-gray-600 font-Primary text-sm text-center">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mb-8 flex justify-center">
        <div className="max-w-2xl bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 px-4 py-3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:4px_4px]">
          <p className="text-gray-600 font-Primary text-sm text-center">No comments yet</p>
        </div>
      </div>
    );
  }

  const currentComment = comments[currentIndex];

  return (
    <div className="mb-8 flex justify-center">
      <div className="max-w-2xl bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 px-4 py-3 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:4px_4px]">
        {/* Comment content */}
        <div className="text-center">
          <p className="font-Primary text-sm text-gray-800">
            <span className="font-medium">{truncateText(currentComment.authorName || 'Anonymous', 15)}</span>
            <span className="text-gray-600"> - {truncateText(currentComment.content || 'No comment', 50)}</span>
            <span className="text-rose-600"> on "{truncateText(getPostTitle(currentComment.postId), 20)}"</span>
          </p>
        </div>

        {/* Dots indicator */}
        {comments.length > 1 && (
          <div className="flex justify-center space-x-1 mt-2">
            {comments.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-rose-600' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSlider;