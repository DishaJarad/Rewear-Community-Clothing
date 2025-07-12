import React, { useState } from 'react';
import { useEffect } from 'react';
import { Users, Package, ShoppingBag, Shield, Eye, CheckCircle, XCircle, Trash2, UserCheck, UserX, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { items, swaps, users, approveItem, rejectItem, deleteItem, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState('manage-users');
  
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const pendingItems = items.filter(item => !item.isApproved);
  const totalUsers = users.length;
  const totalItems = items.length;
  const totalSwaps = swaps.length;

  const stats = [
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Items', value: totalItems, icon: Package, color: 'bg-green-100 text-green-600' },
    { label: 'Pending Reviews', value: pendingItems.length, icon: Eye, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Swaps', value: totalSwaps, icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
  ];

  const handleApproveItem = (itemId: string) => {
    approveItem(itemId);
  };

  const handleRejectItem = (itemId: string) => {
    rejectItem(itemId);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItem(itemId);
  };

  const handleSuspendUser = (userId: string) => {
    updateUser(userId, { status: 'suspended' });
  };

  const handleActivateUser = (userId: string) => {
    updateUser(userId, { status: 'active' });
  };
  
  // Real-time updates
  useEffect(() => {
    const handleItemAdded = () => {
      // Force re-render by updating a state
      setActiveTab(prev => prev);
    };
    
    const handleItemApproved = () => {
      // Force re-render by updating a state
      setActiveTab(prev => prev);
    };
    
    const handleItemRejected = () => {
      // Force re-render by updating a state
      setActiveTab(prev => prev);
    };
    
    window.addEventListener('itemAdded', handleItemAdded);
    window.addEventListener('itemApproved', handleItemApproved);
    window.addEventListener('itemRejected', handleItemRejected);
    
    return () => {
      window.removeEventListener('itemAdded', handleItemAdded);
      window.removeEventListener('itemApproved', handleItemApproved);
      window.removeEventListener('itemRejected', handleItemRejected);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage users, moderate content, and oversee platform activity</p>
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
                { id: 'manage-users', label: 'Manage Users' },
                { id: 'manage-orders', label: 'Manage Orders' },
                { id: 'manage-listings', label: 'Manage Listings' },
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
            {activeTab === 'manage-users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="all">All Users</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Points</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userData) => (
                        <tr key={userData.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {userData.profileImage ? (
                                <img
                                  src={userData.profileImage}
                                  alt={userData.firstName}
                                  className="w-8 h-8 rounded-full mr-3"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <span>{userData.firstName} {userData.lastName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{userData.email}</td>
                          <td className="py-3 px-4 text-gray-600">{userData.points}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              userData.status === 'active' ? 'bg-green-100 text-green-800' :
                              userData.status === 'suspended' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {userData.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(userData.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">
                                <Edit className="h-4 w-4" />
                              </button>
                              {userData.status === 'active' ? (
                                <button 
                                  onClick={() => handleSuspendUser(userData.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  <UserX className="h-4 w-4" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleActivateUser(userData.id)}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'manage-orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order Management (New Listings)</h3>
                  <div className="flex items-center space-x-3">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h4>
                            <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Category:</span>
                                <p className="text-gray-600 capitalize">{item.category.replace('-', ' ')}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Size:</span>
                                <p className="text-gray-600">{item.size}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Condition:</span>
                                <p className="text-gray-600 capitalize">{item.condition}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Points:</span>
                                <p className="text-gray-600">{item.pointValue}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center">
                              <img
                                src={item.userImage}
                                alt={item.userName}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span className="text-sm text-gray-600">Listed by {item.userName}</span>
                              <span className="text-sm text-gray-400 ml-4">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-4">
                          <button
                            onClick={() => handleApproveItem(item.id)}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Order
                          </button>
                          <button
                            onClick={() => handleRejectItem(item.id)}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline Order
                          </button>
                        </div>
                      </div>
                      
                      {item.tags.length > 0 && (
                        <div className="mt-4">
                          <span className="text-sm font-medium text-gray-700">Tags: </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {pendingItems.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No pending orders to review</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'manage-listings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Listing Management</h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Search listings..."
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="all">All Listings</option>
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="swapped">Swapped</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600">by {item.userName}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">{item.pointValue} points</span>
                              <span className="text-sm text-gray-500 capitalize">{item.category.replace('-', ' ')}</span>
                              <span className="text-sm text-gray-500">Size {item.size}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.isApproved 
                              ? item.status === 'available' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.isApproved ? item.status : 'Under Review'}
                          </span>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onNavigate('item-detail')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;