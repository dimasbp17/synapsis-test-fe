import api from '@/lib/axios';

export interface User {
  id: string;
  name: string;
  email: string;
}

// get users
export const fetchUsers = async (token: string): Promise<User[]> => {
  try {
    const response = await api.get('/public/v2/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error('Invalid token');
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.error('An error occurred while retrieving user data');
    throw new Error('An error occurred while retrieving user data');
  }
};

// get detail users
export const fetchUserDetail = async (userId: number) => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch user details: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error('An error occurred while fetching user details');
  }
};
