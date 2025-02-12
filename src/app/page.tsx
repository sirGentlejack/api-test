'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  // Define the structure of a post
  interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }

  // State variables for managing data, loading, errors, form inputs, and responses
  const [data, setData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<{ title: string; body: string }>({ title: '', body: '' });
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [postId, setPostId] = useState<number | null>(null);

  // Fetch a random post when component mounts or when postId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${Math.floor(Math.random() * 100) + 1}`);
        setData(response.data); // Store fetched data in state
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false); // Stop loading once request is complete
      }
    };

    fetchData();
  }, [postId]); // Trigger re-fetch when postId changes

  // Handle form submission to create a new post
  const handlePostSubmit = async () => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', newPost, {
        headers: { 'Content-Type': 'application/json' }
      });
      setResponseMessage(`Post created with ID: ${response.data.id}`); // Display response message
      setPostId(response.data.id); // Update postId to trigger a new fetch
      setNewPost({ title: '', body: '' }); // Clear input fields after submission
    } catch (err) {
      setResponseMessage(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
    }
  };

  // Display loading or error messages if applicable
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {/* Display fetched post data */}
      {data ? (
        <>
          <h1 className='font-extrabold'>{data.title}</h1>
          <p>{data.body}</p>
        </>
      ) : (
        <p>No data available</p>
      )}

      {/* Form to create a new post */}
      <h2 className='mt-4 font-bold'>Create a New Post</h2>
      <input 
        type="text" 
        placeholder="Title" 
        value={newPost.title} 
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} 
        className='border p-2 w-full text-black'
      />
      <textarea 
        placeholder="Body" 
        value={newPost.body} 
        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })} 
        className='border p-2 w-full mt-2 text-black'
      />
      <button onClick={handlePostSubmit} className='mt-2 p-2 bg-blue-500 text-white rounded'>Submit</button>

      {/* Display response message after submitting a post */}
      {responseMessage && <p className='mt-2 text-green-600'>{responseMessage}</p>}
    </div>
  );
}
