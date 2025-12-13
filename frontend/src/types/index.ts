export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SweetFormData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}