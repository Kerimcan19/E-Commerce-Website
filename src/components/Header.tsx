import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import LoginModal from './LoginModal';
import Cart from './Cart';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  setCurrentPage
}) => {
  const { user, logout } = useAuth();
  const { cart, categories } = useStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
              >
                TechStore
              </button>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role === 'admin' && (
                    <button
                      onClick={() => setCurrentPage('admin')}
                      className="flex items-center text-blue-700 hover:text-blue-800 font-medium"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentPage('orders')}
                    className="text-gray-700 hover:text-blue-700 font-medium"
                  >
                    Orders
                  </button>
                  <span className="text-gray-700">Hello, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-blue-700 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center text-blue-700 hover:text-blue-800 font-medium"
                >
                  <User className="h-4 w-4 mr-1" />
                  Login
                </button>
              )}

              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-700 hover:text-blue-700 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-700"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowCart(true)}
                    className="flex items-center text-gray-700 hover:text-blue-700"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({cartItemCount})
                  </button>
                  
                  {user ? (
                    <div className="space-y-2">
                      {user.role === 'admin' && (
                        <button
                          onClick={() => setCurrentPage('admin')}
                          className="block text-blue-700 hover:text-blue-800 font-medium"
                        >
                          Admin Panel
                        </button>
                      )}
                      <button
                        onClick={() => setCurrentPage('orders')}
                        className="block text-gray-700 hover:text-blue-700 font-medium"
                      >
                        Orders
                      </button>
                      <button
                        onClick={logout}
                        className="block text-gray-600 hover:text-blue-700 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLogin(true)}
                      className="text-blue-700 hover:text-blue-800 font-medium"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </>
  );
};

export default Header;