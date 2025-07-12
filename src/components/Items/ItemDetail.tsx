import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, User, Star, Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface ItemDetailProps {
  itemId: string;
  onNavigate: (page: string) => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ itemId, onNavigate }) => {
  const { user } = useAuth();
  const { items, addSwapRequest, redeemWithPoints } = useApp();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  
  const item = items.find(i => i.id === itemId && i.isApproved);
  
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <button
            onClick={() => onNavigate('home')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const handleSwapRequest = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    
    setShowSwapModal(true);
  };

  const submitSwapRequest = () => {
    if (!user) return;
    
    addSwapRequest({
      requesterId: user.id,
      requesterName: `${user.firstName} ${user.lastName}`,
      ownerId: item.userId,
      ownerName: item.userName,
      itemId: item.id,
      itemTitle: item.title,
      status: 'pending',
      message: swapMessage
    });
    
    setShowSwapModal(false);
    setSwapMessage('');
    
    // Show success message to requester
    alert(`Swap request sent to ${item.userName}! You'll be notified when they respond.`);
  };

  const handleRedeemWithPoints = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    
    if (user.points < item.pointValue) {
      alert(`You need ${item.pointValue - user.points} more points to redeem this item.`);
      return;
    }
    
    const success = redeemWithPoints(item.id, user.id);
    if (success) {
      onNavigate('dashboard');
    } else {
      alert('Redemption failed. Please try again.');
    }
  };
  const canUserSwap = user && user.id !== item.userId && item.status === 'available';
  const hasEnoughPoints = user && user.points >= item.pointValue;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Browse
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={item.images[selectedImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-green-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-green-600">{item.pointValue} points</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Size</span>
                  <span className="text-lg font-semibold text-gray-900">{item.size}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Condition</span>
                  <span className="text-lg font-semibold text-gray-900 capitalize">{item.condition}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Category</span>
                  <span className="text-lg font-semibold text-gray-900 capitalize">{item.category}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Type</span>
                  <span className="text-lg font-semibold text-gray-900">{item.type}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {canUserSwap && (
                <div className="space-y-3">
                  <button
                    onClick={handleSwapRequest}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Request Swap
                  </button>
                  
                  {hasEnoughPoints ? (
                    <button 
                      onClick={handleRedeemWithPoints}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Star className="h-5 w-5 mr-2" />
                      Redeem with Points
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                    >
                      Need {item.pointValue - (user?.points || 0)} more points
                    </button>
                  )}
                </div>
              )}

              {!user && (
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Sign in to Swap
                </button>
              )}
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4">
                {item.userImage ? (
                  <img
                    src={item.userImage}
                    alt={item.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{item.userName}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Listed {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Request Swap</h3>
            <p className="text-gray-600 mb-4">
              Send a message to {item.userName} about swapping for "{item.title}"
            </p>
            <textarea
              value={swapMessage}
              onChange={(e) => setSwapMessage(e.target.value)}
              placeholder="Hi! I'm interested in swapping for this item. I have..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitSwapRequest}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;