import axios from 'axios';
import { auth } from '../config/firebase';
const API_PREFIX = '/mindmaps';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  parentId: string | null;
  color: string;
}

interface MindMap {
  _id: string;
  userId: string;
  title: string;
  nodes: MindMapNode[];
  createdAt: string;
  updatedAt: string;
}

interface MindMapListItem {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeader = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (err) {
    // If token retrieval fails, continue without Authorization header;
    // server will return 401 and frontend can handle it.
    console.warn('mindmapApi: failed to get ID token', err);
  }
  return headers;
};

export const mindmapApi = {
  // Get all mind maps
  getAll: async (): Promise<MindMapListItem[]> => {
    const { data } = await axios.get(`${API_PREFIX}`, { headers: await getAuthHeader() });
    return data;
  },

  // Get a specific mind map
  get: async (id: string): Promise<MindMap> => {
    const { data } = await axios.get(`${API_PREFIX}/${id}`, { headers: await getAuthHeader() });
    return data;
  },

  // Create a new mind map
  create: async (title: string, nodes: MindMapNode[]): Promise<MindMap> => {
    const { data } = await axios.post(`${API_PREFIX}`, { title, nodes }, { headers: await getAuthHeader() });
    return data;
  },

  // Update a mind map
  update: async (id: string, title: string, nodes: MindMapNode[]): Promise<MindMap> => {
    const { data } = await axios.put(`${API_PREFIX}/${id}`, { title, nodes }, { headers: await getAuthHeader() });
    return data;
  },

  // Delete a mind map
  delete: async (id: string): Promise<void> => {
    const response = await axios.delete(`${API_PREFIX}/${id}`, { headers: await getAuthHeader() });
    if (response.status >= 400) throw new Error('Failed to delete mind map');
  }
};
