'use client'
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { revalidateSite } from '../app/actions';
import { cleanMsoContent } from '../lib/content';
import ContentEditable from 'react-contenteditable';
import { generateMetaDescription } from "../utils/metaUtils"


const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setTitle(postData.title);
          setContent(postData.content);
          setImageUrl(postData.imageUrl || '');
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to fetch post');
        // console.error('Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to edit a post');
        return;
      }

      const cleanContent = cleanMsoContent(content);
      const docRef = doc(db, 'posts', id);
      await updateDoc(docRef, {
        title,
        content: cleanContent,
        imageUrl,
        updatedAt: new Date(),
        // Update meta information
        metaTitle: title,
        metaDescription: generateMetaDescription(cleanContent),
        metaImage: imageUrl
      });
      await revalidateSite(id).catch(() => {});
      router.push(`/post/${id}`);
    } catch (err) {
      setError('An error occurred while updating the post');
      console.error('Error updating post:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('You must be logged in to delete a post');
          return;
        }
        await deleteDoc(doc(db, 'posts', id));
        await revalidateSite(id).catch(() => {});
        router.push('/');
      } catch (err) {
        setError('An error occurred while deleting the post');
        // console.error('Error deleting post:', err);
      }
    }
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="form-error">{error}</div>;
  }

  

  return (
    <div className="form-page">
      <p className="kicker red">Writing desk</p>
      <h1>Edit Post</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 24 }}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {imageUrl && (
          <div>
            <img 
              src={imageUrl} 
              alt="Post preview" 
              style={{ width: "100%", height: 256, objectFit: "cover" }}
            />
          </div>
        )}
        <div>
          <label htmlFor="content">Content</label>

          {/* Editor Toolbar */}
          <div className="editor-bar">
            <button
              type="button"
              onClick={() => applyFormat('bold')}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat('italic')}
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat('underline')}
            >
              U
            </button>
            <button
              type="button"
              onClick={() => applyFormat('formatBlock', 'h1')}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => applyFormat('formatBlock', 'h2')}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => applyFormat('insertUnorderedList')}
            >
              • List
            </button>
          </div>

          {/* Rich Text Editor */}
          <ContentEditable
            html={content}
            onChange={handleContentChange}
            className=""
            style={{ minHeight: '300px' }}
            placeholder="Write your content here..."
          />
        </div>
        <div className="form-actions" style={{ justifyContent: "space-between" }}>
          <button type="submit" className="pill red">
            Update Post
          </button>
          <button 
            type="button" 
            onClick={handleDelete} 
            className="pill"
          >
            Delete Post
          </button>
        </div>
      </form>

    </div>
  );
};

export default EditPost;