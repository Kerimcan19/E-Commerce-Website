import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  stock: number;
  specifications: Record<string, string>;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

interface StoreContextType {
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: Order['shippingAddress']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const mockCategories: Category[] = [
  { id: '1', name: 'Laptops', description: 'High-performance laptops and notebooks' },
  { id: '2', name: 'Smartphones', description: 'Latest smartphones and mobile devices' },
  { id: '3', name: 'Gaming', description: 'Gaming peripherals and accessories' },
  { id: '4', name: 'Audio', description: 'Headphones, speakers, and audio equipment' },
  { id: '5', name: 'Accessories', description: 'Cables, chargers, and tech accessories' },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop with M3 Pro chip, perfect for professional work and creative tasks.',
    price: 2499,
    categoryId: '1',
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 15,
    specifications: { 'Processor': 'Apple M3 Pro', 'RAM': '32GB', 'Storage': '1TB SSD', 'Display': '16.2-inch Retina' }
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with titanium design and advanced camera system.',
    price: 999,
    categoryId: '2',
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 25,
    specifications: { 'Display': '6.1-inch Super Retina XDR', 'Storage': '256GB', 'Camera': '48MP Main', 'Chip': 'A17 Pro' }
  },
  {
    id: '3',
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches for ultimate gaming experience.',
    price: 149,
    categoryId: '3',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 40,
    specifications: { 'Switch Type': 'Cherry MX Blue', 'Backlight': 'RGB', 'Connectivity': 'USB-C', 'Layout': 'Full Size' }
  },
  {
    id: '4',
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 299,
    categoryId: '4',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 30,
    specifications: { 'Battery Life': '30 hours', 'Noise Cancellation': 'Active ANC', 'Connectivity': 'Bluetooth 5.0', 'Weight': '250g' }
  },
  {
    id: '5',
    name: 'Dell XPS 13',
    description: 'Ultra-thin laptop with InfinityEdge display and Intel Core i7 processor.',
    price: 1299,
    categoryId: '1',
    image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 20,
    specifications: { 'Processor': 'Intel Core i7-1365U', 'RAM': '16GB', 'Storage': '512GB SSD', 'Display': '13.4-inch FHD+' }
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Flagship Android phone with S Pen and advanced AI features.',
    price: 1199,
    categoryId: '2',
    image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 18,
    specifications: { 'Display': '6.8-inch Dynamic AMOLED 2X', 'Storage': '512GB', 'Camera': '200MP Main', 'S Pen': 'Included' }
  },
  {
    id: '7',
    name: 'Gaming Mouse RGB',
    description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.',
    price: 79,
    categoryId: '3',
    image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 50,
    specifications: { 'DPI': '16000', 'Buttons': '8 Programmable', 'Connectivity': 'Wireless 2.4GHz', 'Battery': '70 hours' }
  },
  {
    id: '8',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360-degree sound and 20-hour battery life.',
    price: 129,
    categoryId: '4',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500',
    stock: 35,
    specifications: { 'Battery Life': '20 hours', 'Waterproof': 'IPX7', 'Connectivity': 'Bluetooth 5.0', 'Output': '20W' }
  }
];

const mockOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [{ productId: '1', quantity: 1 }, { productId: '4', quantity: 1 }],
    total: 2798,
    status: 'delivered',
    createdAt: '2024-01-15T10:00:00Z',
    shippingAddress: {
      name: 'John Smith',
      address: '123 Tech Street',
      city: 'San Francisco',
      zipCode: '94102',
      country: 'USA'
    }
  },
  {
    id: '2',
    userId: '3',
    items: [{ productId: '2', quantity: 1 }],
    total: 999,
    status: 'shipped',
    createdAt: '2024-01-18T14:30:00Z',
    shippingAddress: {
      name: 'Jane Doe',
      address: '456 Innovation Ave',
      city: 'Austin',
      zipCode: '78701',
      country: 'USA'
    }
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories(prev => [...prev, newCategory]);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const addToCart = (productId: string, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (shippingAddress: Order['shippingAddress']) => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      userId: 'current-user', // This would be the actual user ID
      items: [...cart],
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      shippingAddress
    };

    setOrders(prev => [...prev, newOrder]);
    clearCart();
  };

  return (
    <StoreContext.Provider value={{
      categories,
      products,
      cart,
      orders,
      addCategory,
      addProduct,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};