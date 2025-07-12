import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { ClothingItem } from '../../types';

interface ItemCardProps {
  item: ClothingItem;
  onViewDetails: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetails }) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like-new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'swapped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
            {item.condition}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>
        <button className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{item.title}</h3>
          <span className="text-green-600 font-bold text-lg">{item.pointValue}pts</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Size {item.size}</span>
          <span className="text-sm text-gray-500 capitalize">{item.category}</span>
        </div>

        <div className="flex items-center mb-4">
          {item.userImage && (
            <img
              src={item.userImage}
              alt={item.userName}
              className="w-6 h-6 rounded-full mr-2"
            />
          )}
          <span className="text-sm text-gray-600">{item.userName}</span>
          <Clock className="h-3 w-3 text-gray-400 ml-auto mr-1" />
          <span className="text-xs text-gray-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>

        <button
          onClick={() => onViewDetails(item.id)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ItemCard;