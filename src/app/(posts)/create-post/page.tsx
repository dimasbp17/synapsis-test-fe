'use client';

import { createPost } from '@/services/post';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

interface FormState {
  user_id: number;
  user: string;
  title: string;
  body: string;
}

const CreatePost: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormState>();

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      console.error('User ID not found');
    }
  }, []);

  const mutation = useMutation({
    mutationFn: ({ user_id, user, title, body }: FormState) => {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token not found');
      return createPost({ user_id, user, title, body, token });
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const updatedPosts = [...existingPosts, data];
      localStorage.setItem('posts', JSON.stringify(updatedPosts));

      toast.success(`Post successfully created with ID: ${data.id}`);
      reset();
      router.push('/');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit: SubmitHandler<FormState> = (formData) => {
    if (userId === null) {
      toast.error('User ID not available.');
      return;
    }

    mutation.mutate({
      ...formData,
      user_id: userId,
    });
  };

  return (
    <>
      <Toaster />
      <div className="px-4 lg:px-20 py-10">
        <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="user_name"
              className="block text-sm font-medium"
            >
              Username
            </label>
            <input
              type="text"
              id="user_name"
              placeholder="User Name"
              {...register('user', { required: 'User Name wajib diisi' })}
              className={`mt-1 p-2 border rounded w-full ${
                errors.user ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.user && (
              <p className="text-red-500 text-sm mt-1">{errors.user.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Title"
              {...register('title', { required: 'Title is required' })}
              className={`mt-1 p-2 border rounded w-full ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium"
            >
              Content
            </label>
            <textarea
              id="body"
              placeholder="Write your content here..."
              {...register('body', { required: 'Content is required' })}
              className={`mt-1 p-2 border rounded w-full ${
                errors.body ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
            ></textarea>
            {errors.body && (
              <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 w-full text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Post'}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
