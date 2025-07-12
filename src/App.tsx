import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Header from './components/Layout/Header';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import LandingPage from './components/Home/LandingPage';
import UserDashboard from './components/Dashboard/UserDashboard';
import ItemDetail from './components/Items/ItemDetail';
import AddItemForm from './components/Items/AddItemForm';
import AdminPanel from './components/Admin/AdminPanel';

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'item-detail' | 'add-item' | 'admin';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const { user, isLoading } = useAuth();

  const navigate = (page: Page, itemId?: string) => {
    setCurrentPage(page);
    if (itemId) {
      setSelectedItemId(itemId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth forms without header
  if (!user && (currentPage === 'login' || currentPage === 'register')) {
    return (
      <>
        {currentPage === 'login' && <LoginForm onNavigate={navigate} />}
        {currentPage === 'register' && <RegisterForm onNavigate={navigate} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={navigate} />
      
      {currentPage === 'home' && !user?.isAdmin && <LandingPage onNavigate={navigate} />}
      {currentPage === 'dashboard' && user && !user.isAdmin && <UserDashboard onNavigate={navigate} />}
      {currentPage === 'item-detail' && <ItemDetail itemId={selectedItemId} onNavigate={navigate} />}
      {currentPage === 'add-item' && !user?.isAdmin && <AddItemForm onNavigate={navigate} />}
      {currentPage === 'admin' && user?.isAdmin && <AdminPanel onNavigate={navigate} />}
      {currentPage === 'login' && <LoginForm onNavigate={navigate} />}
      {currentPage === 'register' && <RegisterForm onNavigate={navigate} />}
      
      {/* Redirect admin to admin panel */}
      {user?.isAdmin && currentPage === 'home' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome Admin</h2>
            <button
              onClick={() => navigate('admin')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Admin Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;