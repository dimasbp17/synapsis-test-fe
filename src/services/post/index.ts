import api from '@/lib/axios';

interface Post {
  id: number;
  user_id: number;
  user: string;
  title: string;
  body: string;
}

// get post
export const fetchPosts = async (
  page: number,
  perPage: number,
  search: string,
  filterUser: number | undefined
): Promise<Post[]> => {
  const params: Record<string, string | number> = {
    page: page,
    per_page: perPage,
    ...(search && { q: search }),
    ...(filterUser && { user_id: filterUser }),
  };

  try {
    const { data } = await api.get('/public/v2/posts', { params });
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('An error occurred while retrieving post data');
  }
};

// detail post
export const fetchDetailPost = async (postId: number): Promise<Post> => {
  try {
    const { data } = await api.get(`/public/v2/posts/${postId}`);
    return data;
  } catch (error) {
    console.error('Error fetching post details:', error);
    throw new Error('An error occurred while retrieving post details');
  }
};

// create post
export const createPost = async ({
  title,
  body,
  token,
  user_id,
  user,
}: {
  title: string;
  body: string;
  token: string;
  user_id: number;
  user: string;
}): Promise<Post> => {
  const response = await api.post<Post>(
    '/public/v2/posts',
    { title, body, user_id, user },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// delete post
export const deletePost = async (id: number, token: string) => {
  return api.delete(`/public/v2/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// update post
export const updatePost = async (
  postId: number,
  data: { title: string; body: string },
  token: string
): Promise<Post> => {
  const response = await api.put<Post>(`/public/v2/posts/${postId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
