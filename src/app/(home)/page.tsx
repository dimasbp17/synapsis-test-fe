'use client';

import { deletePost, fetchPosts } from '@/services/post';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Modal, Pagination, Select, Spin } from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BiSolidCommentDetail } from 'react-icons/bi';
import { FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';

const { Meta } = Card;

interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

const PostList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState<number | undefined>();
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const pageSize = 10;

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setLocalPosts(savedPosts);

    const storedUserName = localStorage.getItem('userName') ?? '';
    setUserName(storedUserName);
  }, []);

  const {
    data: apiPosts,
    isLoading,
    isError,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['posts', searchQuery, filterUser],
    queryFn: () => fetchPosts(currentPage, pageSize, searchQuery, filterUser),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Token not found');

      if (localPosts.some((post) => post.id === id)) {
        const updatedLocalPosts = localPosts.filter((post) => post.id !== id);
        localStorage.setItem('posts', JSON.stringify(updatedLocalPosts));
        setLocalPosts(updatedLocalPosts);
        return { id };
      }

      await deletePost(id, token);
      return { id };
    },
    onSuccess: () => {
      toast.success(`Post successfully deleted.`);
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    },
  });

  const showModal = (id: number) => {
    setSelectedPostId(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (selectedPostId !== null) {
      deleteMutation.mutate(selectedPostId);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPostId(null);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilter = (value: number | undefined) => {
    setFilterUser(value);
    setCurrentPage(1);
  };

  const combinedPosts = [
    ...(apiPosts || []),
    ...localPosts.filter(
      (localPost) =>
        !(apiPosts || []).some((apiPost) => apiPost.id === localPost.id)
    ),
  ];

  const filteredPosts = combinedPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filterUser ? post.user_id === filterUser : true;
    return matchesSearch && matchesFilter;
  });

  const totalPosts = filteredPosts.length;
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin
          tip="Loading posts..."
          size="large"
        />
      </div>
    );
  }

  if (isError) {
    toast.error('Failed to fetch posts.');
    return null;
  }

  return (
    <>
      <Toaster />
      <Modal
        title="Confirm Delete"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>

      <div className="space-y-4 my-5 px-4 lg:px-20">
        <h1 className="font-bold text-lg bg-white text-orange-500 shadow-md p-5 rounded-md">
          Welcome <span className="text-2xl text-blue-600">{userName}</span>
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full"
            >
              <Input
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className=""
              />
            </form>

            <Select
              placeholder="Filter by user"
              allowClear
              onChange={handleFilter}
              className=""
            >
              <Select.Option value={1}>User 1</Select.Option>
              <Select.Option value={2}>User 2</Select.Option>
            </Select>
          </div>
          <div className="ms-auto">
            <Link href={'/create-post'}>
              <Button
                className="font-poppins"
                type="primary"
                size="large"
              >
                Create Post
              </Button>
            </Link>
          </div>
        </div>

        {paginatedPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {paginatedPosts.map((post) => (
              <Card
                key={post.id}
                hoverable
                className="border shadow-md h-fit font-poppins cursor-default bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 text-justify"
              >
                <div className="text-orange-500 mb-3">
                  <BiSolidCommentDetail size={20} />
                </div>
                <Meta
                  className="text-gray-800"
                  title={post.title}
                  description={post.body.substring(0, 100) + '...'}
                />
                <div className="flex justify-between items-center">
                  <Link href={`/detail-post/${post.id}`}>
                    <Button
                      variant="solid"
                      size="small"
                      className="mt-3 bg-green-600 text-xs text-white"
                    >
                      View detail
                    </Button>
                  </Link>
                  <div className="space-x-2">
                    <Link href={`/edit-post/${post.id}`}>
                      <Button
                        variant="solid"
                        size="small"
                        className="mt-3 bg-amber-400 text-white"
                      >
                        <MdEdit size={10} />
                      </Button>
                    </Link>
                    <Button
                      variant="solid"
                      size="small"
                      className="mt-3 bg-red-500 text-white"
                      onClick={() => showModal(post.id)}
                    >
                      <FaTrashAlt size={10} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPosts > 0 && (
          <Pagination
            current={currentPage}
            onChange={(page) => setCurrentPage(page)}
            total={totalPosts}
            pageSize={pageSize}
            className="flex justify-center mt-6"
          />
        )}
      </div>
    </>
  );
};

export default PostList;
