import React from 'react';
import { categories } from '../../data/mockData';

interface CategorySectionProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">Discover amazing pieces in every style</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <button
            onClick={() => onCategorySelect('all')}
            className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'ring-4 ring-green-500 ring-opacity-50'
                : 'hover:scale-105'
            }`}
          >
            <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">All</span>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            <div className="p-3 bg-white">
              <h3 className="font-semibold text-gray-900 text-center">All Items</h3>
              <p className="text-sm text-gray-500 text-center">Browse everything</p>
            </div>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'ring-4 ring-green-500 ring-opacity-50'
                  : 'hover:scale-105'
              }`}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              <div className="p-3 bg-white">
                <h3 className="font-semibold text-gray-900 text-center">{category.name}</h3>
                <p className="text-sm text-gray-500 text-center">{category.count} items</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;