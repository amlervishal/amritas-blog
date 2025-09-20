'use client'
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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
  const auth = getAuth();
  const db = getFirestore();

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
  }, [id, db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to edit a post');
        return;
      }

      // Debug: Log what we're trying to save
      console.log('Saving content:', content);
      console.log('Content type:', typeof content);
      console.log('Content length:', content?.length);

      const docRef = doc(db, 'posts', id);
      await updateDoc(docRef, {
        title,
        content,
        imageUrl,
        updatedAt: new Date(),
        // Update meta information
        metaTitle: title,
        metaDescription: generateMetaDescription(content),
        metaImage: imageUrl
      });
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
    return <div className="text-red-500">{error}</div>;
  }

  

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-Primary font-medium text-center mb-4">Edit Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
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
          <label htmlFor="imageUrl" className="block mb-1">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {imageUrl && (
          <div>
            <img 
              src={imageUrl} 
              alt="Post preview" 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        <div>
          <label htmlFor="content" className="block mb-1">Content</label>

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
        <div className="flex justify-between pt-8">
          <button type="submit" className="bg-green-700 font-Primary text-sm text-white px-4 py-2 rounded-full">
            Update Post
          </button>
          <button 
            type="button" 
            onClick={handleDelete} 
            className="bg-rose-600 font-Primary text-sm text-white px-4 py-2 rounded-full"
          >
            Delete Post
          </button>
        </div>
      </form>

    </div>
  );
};

export default EditPost;