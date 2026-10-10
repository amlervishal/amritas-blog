'use client'
import { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';

const PROJECT = 'pindropsilence-26bda';
const RUN_QUERY = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery`;

// Light-weight refresh over REST (no Firebase SDK) so a cached page never hides new comments.
async function fetchFreshComments(postId) {
  const res = await fetch(RUN_QUERY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'comments' }],
        where: { fieldFilter: { field: { fieldPath: 'postId' }, op: 'EQUAL', value: { stringValue: postId } } },
      },
    }),
  });
  if (!res.ok) throw new Error('comments fetch failed');
  const rows = await res.json();
  return rows
    .filter((r) => r.document)
    .map((r) => {
      const f = r.document.fields || {};
      const createdAt = f.createdAt?.timestampValue || null;
      return {
        id: r.document.name.split('/').pop(),
        authorName: f.authorName?.stringValue || 'Anonymous',
        content: f.content?.stringValue || '',
        createdAt,
        date: createdAt ? new Date(createdAt).toLocaleDateString() : '',
      };
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

// initialComments are server-rendered (so they are in the HTML); we refresh them on mount.
const Comments = ({ postId, initialComments = [] }) => {
  const user = useUser();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    fetchFreshComments(postId)
      .then((list) => { if (!cancelled) setComments(list); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !postId) return;

    setLoading(true);
    try {
      // Firestore SDK is only downloaded when someone actually posts a comment
      const [{ collection, addDoc }, { db }] = await Promise.all([
        import('firebase/firestore'),
        import('../utils/firebaseDb'),
      ]);
      const createdAt = new Date();
      const commentData = {
        content: newComment,
        authorName: user.displayName || user.email,
        authorId: user.uid,
        createdAt,
        postId: postId
      };

      const docRef = await addDoc(collection(db, 'comments'), commentData);

      setComments([
        { id: docRef.id, authorName: commentData.authorName, content: commentData.content, createdAt: createdAt.toISOString(), date: createdAt.toLocaleDateString() },
        ...comments,
      ]);
      setNewComment('');
    } catch (error) {
      // console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-Primary font-semibold mb-4">Comments</h2>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            aria-label="Write a comment"
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700 font-Primary text-sm mb-2">
            💬 Want to join the conversation?
          </p>
          <p className="text-gray-600 font-Primary text-sm mb-3">
            Sign in with your Google account to leave comments and engage with other readers.
          </p>
          <a
            href="/signin"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-Primary text-sm px-4 py-2 rounded-full transition-colors duration-200"
          >
            Sign in to comment
          </a>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 font-Primary text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg mb-4 border max-w-full">
              <div className="flex justify-between items-start mb-2">
                <span className="font-Primary font-medium text-sm text-gray-800">{comment.authorName}</span>
                <span className="text-gray-500 font-Primary text-xs flex-shrink-0 ml-4" suppressHydrationWarning>
                  {comment.date || 'Just now'}
                </span>
              </div>
              <p className="text-gray-700 font-Primary text-sm break-words">{comment.content || 'No comment text'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
