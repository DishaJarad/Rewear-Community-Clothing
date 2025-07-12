import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClothingItem, Swap, User } from '../types';
import { mockItems as initialItems, mockSwaps as initialSwaps, mockUsers as initialUsers } from '../data/mockData';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  userId: string;
  createdAt: string;
  read: boolean;
}

interface AppContextType {
  items: ClothingItem[];
  swaps: Swap[];
  users: User[];
  notifications: Notification[];
  addItem: (item: Omit<ClothingItem, 'id' | 'createdAt'>) => string;
  approveItem: (itemId: string) => void;
  rejectItem: (itemId: string) => void;
  deleteItem: (itemId: string) => void;
  addSwapRequest: (swap: Omit<Swap, 'id' | 'createdAt'>) => void;
  updateSwapStatus: (swapId: string, status: Swap['status']) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ClothingItem[]>(initialItems);
  const [swaps, setSwaps] = useState<Swap[]>(initialSwaps);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addItem = (itemData: Omit<ClothingItem, 'id' | 'createdAt'>): string => {
    const newItem: ClothingItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isApproved: false,
      status: 'under-review'
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Trigger real-time update for admin panel
    window.dispatchEvent(new CustomEvent('itemAdded', { detail: newItem }));
    
    return newItem.id;
  };

  const approveItem = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isApproved: true, status: 'available' as const }
        : item
    ));

    // Find the item to get user info
    const item = items.find(i => i.id === itemId);
    if (item) {
      addNotification({
        type: 'success',
        title: 'Item Approved!',
        message: `Congratulations! Your item "${item.title}" has been approved and is now live on the platform.`,
        userId: item.userId,
        read: false
      });
    }
    
    // Trigger real-time update
    window.dispatchEvent(new CustomEvent('itemApproved', { detail: itemId }));
  };

  const rejectItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      addNotification({
        type: 'warning',
        title: 'Item Rejected',
        message: `Your item "${item.title}" was not approved for listing. Please review our guidelines and try again.`,
        userId: item.userId,
        read: false
      });
    }
    
    setItems(prev => prev.filter(item => item.id !== itemId));
    
    // Trigger real-time update
    window.dispatchEvent(new CustomEvent('itemRejected', { detail: itemId }));
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addSwapRequest = (swapData: Omit<Swap, 'id' | 'createdAt'>) => {
    const newSwap: Swap = {
      ...swapData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setSwaps(prev => [...prev, newSwap]);

    // Notify the item owner about the swap request
    addNotification({
      type: 'info',
      title: 'New Swap Request',
      message: `${swapData.requesterName} wants to swap for your item "${swapData.itemTitle}".`,
      userId: swapData.ownerId,
      read: false
    });
    
    // Trigger real-time update
    window.dispatchEvent(new CustomEvent('swapRequestAdded', { detail: newSwap }));
  };

  const updateSwapStatus = (swapId: string, status: Swap['status']) => {
    const swap = swaps.find(s => s.id === swapId);
    if (!swap) return;

    setSwaps(prev => prev.map(swap => 
      swap.id === swapId ? { ...swap, status } : swap
    ));

    // Send notifications based on status
    if (status === 'accepted') {
      // Notify requester
      addNotification({
        type: 'success',
        title: 'Swap Request Accepted! 🎉',
        message: `Great news! ${swap.ownerName} accepted your swap request for "${swap.itemTitle}". You can now coordinate the exchange.`,
        userId: swap.requesterId,
        read: false
      });
      
      // Notify owner
      addNotification({
        type: 'success',
        title: 'Swap Request Accepted',
        message: `You accepted the swap request from ${swap.requesterName} for "${swap.itemTitle}". Please coordinate the exchange.`,
        userId: swap.ownerId,
        read: false
      });
    } else if (status === 'rejected') {
      // Notify requester
      addNotification({
        type: 'error',
        title: 'Swap Request Declined',
        message: `${swap.ownerName} declined your swap request for "${swap.itemTitle}". Don't worry, there are many other great items to explore!`,
        userId: swap.requesterId,
        read: false
      });
      
      // Notify owner
      addNotification({
        type: 'info',
        title: 'Swap Request Declined',
        message: `You declined the swap request from ${swap.requesterName} for "${swap.itemTitle}".`,
        userId: swap.ownerId,
        read: false
      });
    }
    
    // Trigger real-time updates across all user sessions
    window.dispatchEvent(new CustomEvent('swapStatusUpdated', { 
      detail: { swapId, status, swap } 
    }));
    
    // Trigger notification updates for all users
    window.dispatchEvent(new CustomEvent('notificationAdded', { 
      detail: { requesterId: swap.requesterId, ownerId: swap.ownerId } 
    }));
  };

  const redeemWithPoints = (itemId: string, userId: string) => {
    const item = items.find(i => i.id === itemId);
    const user = users.find(u => u.id === userId);
    
    if (!item || !user) return false;
    
    if (user.points < item.pointValue) return false;
    
    // Deduct points from user
    updateUser(userId, { points: user.points - item.pointValue });
    
    // Mark item as swapped
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, status: 'swapped' as const } : i
    ));
    
    // Add points to item owner
    const owner = users.find(u => u.id === item.userId);
    if (owner) {
      updateUser(item.userId, { points: owner.points + item.pointValue });
      
      // Notify item owner
      addNotification({
        type: 'success',
        title: 'Item Redeemed!',
        message: `${user.firstName} ${user.lastName} redeemed your item "${item.title}" for ${item.pointValue} points!`,
        userId: item.userId,
        read: false
      });
    }
    
    // Notify redeemer
    addNotification({
      type: 'success',
      title: 'Redemption Successful!',
      message: `You successfully redeemed "${item.title}" for ${item.pointValue} points!`,
      userId: userId,
      read: false
    });
    
    return true;
  };
  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Trigger real-time notification update
    window.dispatchEvent(new CustomEvent('newNotificationAdded', { 
      detail: newNotification 
    }));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  const getUserNotifications = (userId: string): Notification[] => {
    return notifications.filter(notification => notification.userId === userId);
  };

  return (
    <AppContext.Provider value={{
      items,
      swaps,
      users,
      notifications,
      addItem,
      approveItem,
      rejectItem,
      deleteItem,
      addSwapRequest,
      updateSwapStatus,
      addUser,
      updateUser,
      addNotification,
      markNotificationAsRead,
      getUserNotifications,
      redeemWithPoints
    }}>
      {children}
    </AppContext.Provider>
  );
};