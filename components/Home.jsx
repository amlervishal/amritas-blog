'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPosts } from '../services/api';
import Posts from './Posts';
import CommentsSlider from './CommentsSlider';

// Function to check if the user's email is allowed to create/edit posts
const isAllowedToEdit = (userEmail) => {
  const allowedEmails = ['amlervishal@gmail.com', 'dramritavohra@gmail.com']; // Replace with your specific Gmail addresses
  return allowedEmails.includes(userEmail);
};

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // console.log('Starting to fetch posts...');

        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out')), 10000)
        );

        const fetchedPosts = await Promise.race([getPosts(), timeoutPromise]);
        // console.log('Fetched posts:', fetchedPosts);
        setPosts(fetchedPosts || []);
        setLoading(false);
      } catch (err) {
        // console.error('Error fetching posts:', err);
        setError(`Failed to fetch posts: ${err.message}`);
        setLoading(false);
      }
    };

    // Set a fallback timeout to ensure loading state doesn't hang forever
    const fallbackTimeout = setTimeout(() => {
      setError('Loading is taking too long. There might be a connection issue.');
      setLoading(false);
    }, 15000);

    fetchPosts().finally(() => {
      clearTimeout(fallbackTimeout);
    });

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="">
      <CommentsSlider />
      <h1 className="text-xl text-center drop-shadow mb-4 mt-8 font-Logo">Recent Posts</h1>
      {user && isAllowedToEdit(user.email) && (
        <div className="my-8 text-center">
          <Link href="/create" className="bg-rose-600 text-white font-Primary text-sm px-5 py-2 rounded-full">
            Create New Post
          </Link>
        </div>
      )}
      <Posts posts={posts} user={user} />
    </div>
  );
};

export default Home;