import React from 'react';
import { ShoppingBag, User, Search, Plus, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <ShoppingBag className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">ReWear</span>
          </div>

          {/* Navigation */}
          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              {!user.isAdmin && (
                <>
                  <button
                    onClick={() => onNavigate('home')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'home' 
                        ? 'text-green-600' 
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                  >
                    Browse
                  </button>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'dashboard' 
                        ? 'text-green-600' 
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => onNavigate('add-item')}
                    className={`text-sm font-medium transition-colors ${
                      currentPage === 'add-item' 
                        ? 'text-green-600' 
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                  >
                    List Item
                  </button>
                </>
              )}
              {user.isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`text-sm font-medium transition-colors ${
                    currentPage === 'admin' 
                      ? 'text-green-600' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>
          )}

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-4">
              {!user.isAdmin && (
                <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-green-700">{user.points} points</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.firstName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.firstName}
                </span>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('login')}
                className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;