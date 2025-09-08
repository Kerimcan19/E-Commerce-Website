import React from 'react';
import { Package, Calendar, DollarSign, MapPin, ArrowLeft } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';

interface OrderHistoryProps {
  onBack: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack }) => {
  const { orders, products } = useStore();
  const { user } = useAuth();

  const userOrders = orders.filter(order => order.userId === user?.id).reverse();

  const getProductById = (id: string) => products.find(p => p.id === id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-4"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">View your previous orders and their status</p>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-600">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2 md:mt-0">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
                    <div className="space-y-3">
                      {order.items.map((item) => {
                        const product = getProductById(item.productId);
                        return (
                          <div key={item.productId} className="flex items-center space-x-3">
                            <img
                              src={product?.image || ''}
                              alt={product?.name || 'Product'}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{product?.name}</h5>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} × ${product?.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="font-medium text-gray-900">
                              ${((product?.price || 0) * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping & Total */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                        <span className="flex items-center">
                          <DollarSign className="h-5 w-5 mr-1" />
                          Total
                        </span>
                        <span className="text-blue-700">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;