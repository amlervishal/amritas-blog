'use client'

import { useState, useEffect } from 'react';

// comments: [{ id, authorName, content, postTitle }] (latest 5, resolved on the server)
const CommentsSlider = ({ comments = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
            <span className="text-rose-600"> on "{truncateText(currentComment.postTitle || 'Unknown Post', 20)}"</span>
          </p>
        </div>

        {/* Dots indicator */}
        {comments.length > 1 && (
          <div className="flex justify-center space-x-1 mt-2">
            {comments.map((_, index) => (
              <button
                key={index}
                aria-label={`Show comment ${index + 1}`}
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