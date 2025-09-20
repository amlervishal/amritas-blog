'use client'
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; import { } from 'next/navigation';
import { getPosts } from '../services/api';
import Posts from './Posts';

const BlogList = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        // console.log('Fetched data:', data);
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          // console.error('Received data is not an array:', data);
          // Handle the error appropriately, maybe set an error state
        }
      } catch (error) {
        // console.error('Error fetching posts:', error);
        // Handle the error appropriately
      }
    };
  
    fetchPosts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="border-b pb-2">
            <Link href={`/post/${post.id}`} className="text-blue-500 hover:underline text-lg">
              {post.title}
            </Link>
            {user && (
              <Link href={`/edit/${post.id}`} className="ml-4 text-sm text-gray-500 hover:underline">
                Edit
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;