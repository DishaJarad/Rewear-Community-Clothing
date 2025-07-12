export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  points: number;
  isAdmin: boolean;
  createdAt: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: 'kurta-sets' | 'co-ords' | 'tops' | 'dresses' | 't-shirts' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories';
  type: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  condition: 'new' | 'like-new' | 'good' | 'fair';
  tags: string[];
  userId: string;
  userName: string;
  userImage?: string;
  pointValue: number;
  status: 'available' | 'pending' | 'swapped' | 'under-review';
  createdAt: string;
  isApproved: boolean;
  adminNotes?: string;
}

export interface Swap {
  id: string;
  requesterId: string;
  requesterName: string;
  ownerId: string;
  ownerName: string;
  itemId: string;
  itemTitle: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'user' | 'admin') => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  count: number;
}