'use client'
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import { revalidateSite } from '../app/actions';
import { cleanMsoContent } from '../lib/content';
import ContentEditable from 'react-contenteditable';
import { generateMetaDescription } from "../utils/metaUtils"

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to create a post');
        return;
      }
      // Strip pasted MS Word junk before saving: smaller documents, faster page loads
      const cleanContent = cleanMsoContent(content);
      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        content: cleanContent,
        imageUrl,
        authorId: user.uid,
        createdAt: new Date(),
        // Add meta information
        metaTitle: title,
        metaDescription: generateMetaDescription(cleanContent),
        metaImage: imageUrl
      });
      // Purge cached home/post/sitemap so the new post shows up immediately
      await revalidateSite(docRef.id).catch(() => {});
      router.push(`/post/${docRef.id}`);
    } catch (err) {
      setError('An error occurred while creating the post');
      // console.error('Error creating post:', err);
    }
  };




  return (
    <div className="form-page">
      <p className="kicker red">Writing desk</p>
      <h1>Create New Post</h1>
      {error && <p className="form-error">{error}</p>}
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
          <p className="form-hint">
            💡 For Pexels images: Right-click the image → "Copy image address"
            <br />
            Example: https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg
          </p>
        </div>
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
        <div className="form-actions">
          <button type="submit" className="pill red">
            Create Post
          </button>
          <Link href="/" className="pill">
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;