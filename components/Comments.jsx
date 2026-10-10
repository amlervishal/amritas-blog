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
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title">Comments</h2>

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            aria-label="Write a comment"
            rows="3"
          />
          <button type="submit" disabled={loading || !newComment.trim()} className="pill red" style={{ marginTop: 14 }}>
            {loading ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      ) : (
        <div className="invite">
          <p>Want to join the conversation? Sign in with your Google account to leave a comment and write back to the author.</p>
          <a href="/signin" className="pill red">Sign in to comment</a>
        </div>
      )}

      <div>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)', fontStyle: 'italic', fontSize: 21 }}>No comments yet. Be the first to write one.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="comment-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'baseline' }}>
                <span className="who">{comment.authorName}</span>
                <span className="when" suppressHydrationWarning>{comment.date || 'Just now'}</span>
              </div>
              <p style={{ overflowWrap: 'anywhere' }}>{comment.content || 'No comment text'}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default Comments;
