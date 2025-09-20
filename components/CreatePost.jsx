'use client'
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import ContentEditable from 'react-contenteditable';
import { generateMetaDescription } from "../utils/metaUtils"

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

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
      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        content,
        imageUrl,
        authorId: user.uid,
        createdAt: new Date(),
        // Add meta information
        metaTitle: title,
        metaDescription: generateMetaDescription(content),
        metaImage: imageUrl
      });
      router.push(`/post/${docRef.id}`);
    } catch (err) {
      setError('An error occurred while creating the post');
      // console.error('Error creating post:', err);
    }
  };




  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-Primary font-semibold mb-4">Create New Post</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div>
          <label htmlFor="title" className="block font-Primary mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block font-Primary mb-1">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-xs text-gray-500 mt-1 font-Primary">
            💡 For Pexels images: Right-click the image → "Copy image address"
            <br />
            Example: https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg
          </p>
        </div>
        <div>
          <label htmlFor="content" className="block font-Primary mb-1">Content</label>

          {/* Editor Toolbar */}
          <div className="border border-gray-300 border-b-0 rounded-t-lg bg-gray-50 p-2 flex gap-2">
            <button
              type="button"
              onClick={() => applyFormat('bold')}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-200 font-bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat('italic')}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-200 italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat('underline')}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-200 underline"
            >
              U
            </button>
            <button
              type="button"
              onClick={() => applyFormat('formatBlock', 'h1')}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-200"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => applyFormat('formatBlock', 'h2')}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-200"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => applyFormat('insertUnorderedList')}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-200"
            >
              • List
            </button>
          </div>

          {/* Rich Text Editor */}
          <ContentEditable
            html={content}
            onChange={handleContentChange}
            className="w-full p-3 border border-gray-300 rounded-b-lg font-Primary text-sm min-h-[300px] focus:outline-none focus:border-blue-500"
            style={{ minHeight: '300px' }}
            placeholder="Write your content here..."
          />
        </div>
        <div className="pt-8">
          <button type="submit" className="text-rose-600 text-xs font-Primary  border-solid border rounded-full border-rose-600 hover:border-rose-500 tracking-widest hover:text-slate-600 md:text-base px-5 py-0">
            Create Post
          </button>
        </div>
      </form>
      <Link href="/" className="text-slate-700 text-xs font-Primary  border-solid border rounded-full border-slate-600 hover:border-rose-500 tracking-widest hover:text-rose-500 md:text-base px-5 py-0">
          Back to Home
        </Link>
    </div>
  );
};

export default CreatePost;