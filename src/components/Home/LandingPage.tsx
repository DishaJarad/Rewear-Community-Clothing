import React, { useState } from 'react';
import { Search, ArrowRight, Recycle, Users, Shield, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ItemCard from './ItemCard';
import CategorySection from './CategorySection';

interface LandingPageProps {
  onNavigate: (page: string, itemId?: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { items } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Only show approved items
  const approvedItems = items.filter(item => item.isApproved);

  const categories = [
    { id: 'all', name: 'All Items', count: approvedItems.length },
    { id: 'tops', name: 'Tops', count: approvedItems.filter(i => i.category === 'tops').length },
    { id: 'bottoms', name: 'Bottoms', count: approvedItems.filter(i => i.category === 'bottoms').length },
    { id: 'dresses', name: 'Dresses', count: approvedItems.filter(i => i.category === 'dresses').length },
    { id: 'outerwear', name: 'Outerwear', count: approvedItems.filter(i => i.category === 'outerwear').length },
    { id: 'accessories', name: 'Accessories', count: approvedItems.filter(i => i.category === 'accessories').length },
  ];

  const filteredItems = approvedItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredItems = approvedItems.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Give Your Clothes
              <span className="block text-green-200">A Second Life</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Join the sustainable fashion revolution. Swap, trade, and discover amazing pre-loved clothing 
              while reducing waste and saving money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('register')}
                className="bg-white text-green-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-all flex items-center justify-center"
              >
                Start Swapping
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-700 transition-all"
              >
                Browse Items
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ReWear?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of fashion-conscious individuals who are making sustainable choices
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Fashion</h3>
              <p className="text-gray-600">Reduce textile waste and give preloved clothes a new home while building a more sustainable wardrobe.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">Connect with like-minded fashion lovers and build relationships through clothing exchanges.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600">All listings are moderated and verified to ensure a safe and trustworthy trading experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
            <p className="text-lg text-gray-600">Discover amazing pieces from our community</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="transform hover:scale-105 transition-transform">
                <ItemCard 
                  item={item} 
                  onViewDetails={(id) => onNavigate('item-detail', id)}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              View All Items
            </button>
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section id="browse-section" className="py-16 bg-white">
        {/* Category Section */}
        <CategorySection 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Browse Section */}
        <section id="browse-section" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Items</h2>
              <p className="text-lg text-gray-600">Find your next favorite piece</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for items, brands, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}

            {/* Items Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard 
                  key={item.id}
                  item={item} 
                  onViewDetails={(id) => onNavigate('item-detail', id)}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No items found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Sustainable Fashion Journey?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join our community today and discover the joy of sustainable fashion
          </p>
          <button
            onClick={() => onNavigate('add-item')}
            className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-all"
          >
            List Your First Item
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;