import axios from 'axios';

// Automatically normalize base URL to guarantee /api suffix regardless of trailing slashes or user format
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const getNormalizedBaseUrl = (url) => {
  if (!url) return 'http://localhost:4000/api';
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned.endsWith('/api')) {
    cleaned += '/api';
  }
  return cleaned;
};

const API_BASE_URL = getNormalizedBaseUrl(rawBaseUrl);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all posts/articles
export const fetchPosts = async (category) => {
  try {
    const params = category ? { category } : {};
    const response = await api.get('/posts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts from backend:', error);
    throw error;
  }
};

// Fetch single post by ID
export const fetchPostById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

// Create post (Admin only)
export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

// Update post (Admin only)
export const updatePost = async (id, postData) => {
  const response = await api.put(`/posts/${id}`, postData);
  return response.data;
};

// Delete post (Admin only)
export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

// Fetch members
export const fetchMembers = async () => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    console.error('Error fetching members from backend:', error);
    throw error;
  }
};

// Create member (Admin only)
export const createMember = async (memberData) => {
  const response = await api.post('/members', memberData);
  return response.data;
};

// Update member (Admin only)
export const updateMember = async (id, memberData) => {
  const response = await api.put(`/members/${id}`, memberData);
  return response.data;
};

// Delete member (Admin only)
export const deleteMember = async (id) => {
  const response = await api.delete(`/members/${id}`);
  return response.data;
};

// Upload image (Admin only)
export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Google OAuth Login
export const googleLogin = async (idToken) => {
  try {
    const response = await api.post('/auth/google', { idToken, token: idToken });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Get current user profile
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Fetch profile error:', error);
    throw error;
  }
};

export default api;
