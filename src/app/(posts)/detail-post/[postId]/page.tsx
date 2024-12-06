'use client';

import { fetchDetailPost } from '@/services/post';
import { fetchUserDetail } from '@/services/user';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'antd';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

const PostDetail: React.FC = () => {
  const { postId } = useParams();
  const [localPost, setLocalPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      const foundPost = parsedPosts.find(
        (post: Post) => post.id === Number(postId)
      );
      if (foundPost) {
        setLocalPost(foundPost);
        fetchUserDetail(foundPost.user_id)
          .then(setUser)
          .catch(() => setUser(null));
      }
    }
  }, [postId]);

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['postDetail', postId],
    queryFn: () => fetchDetailPost(Number(postId)),
    enabled: !localPost && !!postId,
  });

  useEffect(() => {
    if (post && !localPost) {
      const storedPosts = localStorage.getItem('posts');
      const parsedPosts = storedPosts ? JSON.parse(storedPosts) : [];
      const updatedPosts = [...parsedPosts, post];
      localStorage.setItem('posts', JSON.stringify(updatedPosts));

      fetchUserDetail(post.user_id)
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, [post, localPost, postId]);

  if (isLoading && !localPost)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (isError && !localPost)
    return (
      <div>{(error as Error).message || 'Failed to fetch post details'}</div>
    );

  const displayPost = localPost || post;

  return (
    <div className="px-4 lg:px-20 my-5">
      <h1 className="text-xl font-bold">Detail Post</h1>
      <Card className="font-poppins mt-5 bg-gradient-to-r from-blue-200 to-blue-100">
        <label
          htmlFor=""
          className="text-gray-500"
        >
          Title
        </label>
        <h1 className="font-bold mb-5">{displayPost?.title}</h1>
        <label
          htmlFor=""
          className="mt-5 text-gray-500"
        >
          Content
        </label>
        <p className="text-base">{displayPost?.body}</p>
        {user && <p className="text-gray-500">Written by: {user.name}</p>}
      </Card>
    </div>
  );
};

export default PostDetail;
