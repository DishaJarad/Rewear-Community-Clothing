import React, { useState } from 'react';
import { useEffect } from 'react';
import { Package, Clock, CheckCircle, User, Settings, Plus, Star, Bell, MessageCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface UserDashboardProps {
  onNavigate: (page: string, itemId?: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { items, swaps, getUserNotifications, markNotificationAsRead, updateSwapStatus } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return null;

  const userItems = items.filter(item => item.userId === user.id);
  const userSwaps = swaps.filter(swap => swap.requesterId === user.id || swap.ownerId === user.id);
  const userNotifications = getUserNotifications(user.id);
  const unreadNotifications = userNotifications.filter(n => !n.read);
  
  // Swap requests received by the user (others wanting to swap with their items)
  const receivedSwapRequests = swaps.filter(swap => swap.ownerId === user.id && swap.status === 'pending');
  
  const pendingSwaps = userSwaps.filter(swap => swap.status === 'pending');
  const completedSwaps = userSwaps.filter(swap => swap.status === 'completed');

  const stats = [
    { label: 'Total Items Listed', value: userItems.length, icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending Swaps', value: pendingSwaps.length, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Completed Swaps', value: completedSwaps.length, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Points Balance', value: user.points, icon: Star, color: 'bg-purple-100 text-purple-600' },
  ];

  const handleAcceptSwap = (swapId: string) => {
    updateSwapStatus(swapId, 'accepted');
  };

  const handleDeclineSwap = (swapId: string) => {
    updateSwapStatus(swapId, 'rejected');
  };
  
  // Real-time updates
  useEffect(() => {
    const handleNewNotificationAdded = (event: any) => {
      const notification = event.detail;
      // Only update if this notification is for the current user
      if (notification.userId === user?.id) {
        setActiveTab(prev => prev); // Force re-render
      }
    };
    
    const handleNotificationAdded = () => {
      // Force re-render to show new notifications
      setActiveTab(prev => prev);
    };
    
    const handleSwapRequestAdded = () => {
      // Force re-render by updating a state
      setActiveTab(prev => prev);
    };
    
    const handleSwapStatusUpdated = () => {
      // Force re-render by updating a state
      setActiveTab(prev => prev);
    };
    
    window.addEventListener('newNotificationAdded', handleNewNotificationAdded);
    window.addEventListener('notificationAdded', handleNotificationAdded);
    window.addEventListener('swapRequestAdded', handleSwapRequestAdded);
    window.addEventListener('swapStatusUpdated', handleSwapStatusUpdated);
    
    return () => {
      window.removeEventListener('newNotificationAdded', handleNewNotificationAdded);
      window.removeEventListener('notificationAdded', handleNotificationAdded);
      window.removeEventListener('swapRequestAdded', handleSwapRequestAdded);
      window.removeEventListener('swapStatusUpdated', handleSwapStatusUpdated);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.firstName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-gray-600">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {userNotifications.length > 0 ? (
                        userNotifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(notification.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => onNavigate('add-item')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Item
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'items', label: 'My Items' },
                { id: 'swaps', label: `Swaps ${receivedSwapRequests.length > 0 ? `(${receivedSwapRequests.length})` : ''}` },
                { id: 'profile', label: 'Profile' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  {userSwaps.length > 0 ? (
                    <div className="space-y-3">
                      {userSwaps.slice(0, 3).map((swap) => (
                        <div key={swap.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{swap.itemTitle}</p>
                            <p className="text-sm text-gray-600">
                              {swap.requesterId === user.id ? `Requested from ${swap.ownerName}` : `Request from ${swap.requesterName}`}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {swap.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No recent activity</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => onNavigate('add-item')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center"
                    >
                      <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-medium text-gray-700">Add New Item</p>
                    </button>
                    <button
                      onClick={() => onNavigate('home')}
                      className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                      <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-medium text-gray-700">Browse Items</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center">
                      <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="font-medium text-gray-700">Earn Points</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Listed Items</h3>
                  <button
                    onClick={() => onNavigate('add-item')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </button>
                </div>
                
                {userItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.pointValue} points</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">You haven't listed any items yet</p>
                    <button
                      onClick={() => onNavigate('add-item')}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      List Your First Item
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'swaps' && (
              <div>
                <div className="space-y-8">
                  {/* Received Swap Requests */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Swap Requests Received ({receivedSwapRequests.length})
                    </h3>
                    
                    {receivedSwapRequests.length > 0 ? (
                      <div className="space-y-4">
                        {receivedSwapRequests.map((swap) => (
                          <div key={swap.id} className="border border-gray-200 rounded-lg p-4 bg-yellow-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <MessageCircle className="h-5 w-5 text-blue-500" />
                                  <h4 className="font-medium text-gray-900">{swap.itemTitle}</h4>
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                    New Request
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  <strong>{swap.requesterName}</strong> wants to swap for this item
                                </p>
                                {swap.message && (
                                  <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                                    <p className="text-sm text-gray-700">"{swap.message}"</p>
                                  </div>
                                )}
                                <p className="text-xs text-gray-500">
                                  Requested on {new Date(swap.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <button
                                  onClick={() => handleAcceptSwap(swap.id)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleDeclineSwap(swap.id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No swap requests received yet</p>
                      </div>
                    )}
                  </div>

                  {/* Swap History */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Swap History</h3>
                
                    {userSwaps.length > 0 ? (
                      <div className="space-y-4">
                        {userSwaps.map((swap) => (
                          <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{swap.itemTitle}</h4>
                                <p className="text-sm text-gray-600">
                                  {swap.requesterId === user.id 
                                    ? `You requested this item from ${swap.ownerName}` 
                                    : `${swap.requesterName} requested this item from you`}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(swap.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {swap.status}
                              </span>
                            </div>
                            {swap.message && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{swap.message}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No swap history yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={user.firstName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={user.lastName}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      readOnly
                    />
                  </div>
                  <p className="text-sm text-gray-500">Profile editing is coming soon!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;