'use client';

import { fetchDetailPost, updatePost } from '@/services/post';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

const EditPostPage = () => {
  const router = useRouter();
  const params = useParams();
  const postId = parseInt(params?.postId as string, 10);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      toast.error('Token not found. You will be directed to the login page.');
      router.push('/');
    }
  }, [router]);

  const {
    data: post,
    isLoading: isFetching,
    error,
  } = useQuery({
    queryKey: ['postDetail', postId],
    queryFn: () => fetchDetailPost(postId),
    enabled: !!token && !isNaN(postId),
  });

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const mutation = useMutation({
    mutationFn: (updatedData: { title: string; body: string }) =>
      updatePost(postId, updatedData, token as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', postId] });
      toast.success('Post updated successfully!');
      router.push('/');
    },

    onError: () => {
      toast.error('Failed to update post.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, body });
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center">Loading tokens...</div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center">
        Loading post details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        Error loading post details.
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center">
        <div className="w-full mt-10 px-4 lg:px-20">
          <h2 className="text-xl font-bold mb-4">Edit Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="body"
                className="block text-sm font-medium mb-2"
              >
                Body
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-2 border rounded"
                rows={5}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Update Post
            </button>
          </form>
          {mutation.isSuccess && (
            <p className="mt-4 text-green-600 text-center">
              Post updated successfully!
            </p>
          )}
          {mutation.isError && (
            <p className="mt-4 text-red-600 text-center">
              Failed to update post. Please try again.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default EditPostPage;
