'use client';

import React, { useState } from 'react';
import { Button, Card, Input, Form } from 'antd';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/user';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { isError, isLoading } = useQuery({
    queryKey: ['fetchUsers', form.getFieldValue('token')],
    queryFn: () => fetchUsers(form.getFieldValue('token')),
    enabled: false,
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      const users = await fetchUsers(values.token);
      const userFound = users.find((user) => user.name === values.name);
      const userId = userFound?.id;

      if (userFound) {
        localStorage.setItem('userName', values.name);
        localStorage.setItem('authToken', values.token);
        localStorage.setItem('user_id', userId ?? '');

        const maxAge = 3 * 60 * 60; // 3 jam
        document.cookie = `userName=${values.name}; max-age=${maxAge}; path=/`;
        document.cookie = `authToken=${values.token}; max-age=${maxAge}; path=/`;
        document.cookie = `user_id=${userId}; max-age=${maxAge}; path=/`;

        router.push('/');
      } else {
        toast.error('Name not found in user list.');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Please fill in all fields.');
      } else {
        toast.error('Invalid token or server error.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen px-4 md:px-0">
      <Card
        style={{ width: 400 }}
        className="shadow-lg font-poppins"
      >
        <div className="text-center mb-5">
          <h3 className="text-lg font-semibold">Welcome to</h3>
          <h1 className="text-3xl font-bold text-blue-800">BlogHive</h1>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input
              placeholder="Enter Your Name"
              className="font-poppins py-2"
            />
          </Form.Item>
          <Form.Item
            label="Token"
            name="token"
            rules={[{ required: true, message: 'Please enter your token' }]}
          >
            <Input
              placeholder="Enter Gorest Token"
              className="font-poppins py-2"
            />
          </Form.Item>
          <Button
            type="primary"
            className="w-full font-poppins"
            size="large"
            loading={isSubmitting || isLoading}
            htmlType="submit"
          >
            Submit
          </Button>
          {isError && <p className="text-red-500">Failed to retrieve data.</p>}
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
