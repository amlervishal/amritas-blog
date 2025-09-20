'use client'
import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase.js';

const Comments = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingComments, setFetchingComments] = useState(true);

  // Fetch comments for this post
  useEffect(() => {
    // console.log('Comments useEffect - postId:', postId);
    if (!postId) {
      // console.log('No postId provided');
      setFetchingComments(false);
      return;
    }

    const fetchComments = async () => {
      try {
        // Simplified approach - get all comments and filter client-side
        const commentsCollection = collection(db, 'comments');
        const querySnapshot = await getDocs(commentsCollection);

        const allComments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter for this specific post
        const postComments = allComments.filter(comment => comment.postId === postId);

        // Sort manually by createdAt
        postComments.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return bTime - aTime; // newest first
        });

        setComments(postComments);
      } catch (error) {
        // console.error('Error fetching comments:', error);
      } finally {
        setFetchingComments(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !postId) return;

    setLoading(true);
    try {
      const commentData = {
        content: newComment,
        authorName: user.displayName || user.email,
        authorId: user.uid,
        createdAt: new Date(),
        postId: postId
      };

      const docRef = await addDoc(collection(db, 'comments'), commentData);

      // Add to local state for immediate UI update
      const newCommentWithId = {
        id: docRef.id,
        ...commentData
      };

      setComments([newCommentWithId, ...comments]);
      setNewComment('');
    } catch (error) {
      // console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-Primary font-semibold mb-4">Comments</h3>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg font-Primary text-sm"
            rows="3"
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-rose-600 text-white rounded-full font-Primary text-sm disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="text-gray-600 font-Primary text-sm mb-6">
          Please sign in to leave a comment.
        </p>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {fetchingComments ? (
          <p className="text-gray-500 font-Primary text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 font-Primary text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment, index) => (
              <div key={comment.id || index} className="bg-gray-50 p-4 rounded-lg mb-4 border max-w-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-Primary font-medium text-sm text-gray-800">
                    {comment.authorName || comment.author || 'Anonymous'}
                  </span>
                  <span className="text-gray-500 font-Primary text-xs flex-shrink-0 ml-4">
                    {comment.createdAt?.toDate ?
                      comment.createdAt.toDate().toLocaleDateString() :
                      comment.createdAt instanceof Date ?
                        comment.createdAt.toLocaleDateString() :
                        typeof comment.createdAt === 'string' ?
                          comment.createdAt :
                          'Just now'
                    }
                  </span>
                </div>
                <p className="text-gray-700 font-Primary text-sm break-words">
                  {comment.content || comment.text || 'No comment text'}
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Comments;