import React, { useState, useEffect } from 'react';
import { LogOut, Package, TrendingUp, DollarSign, AlertCircle, Plus, Minus, ShoppingCart, Clock, X } from 'lucide-react';

const LedgerProApp = () => {
  // ============ STATE MANAGEMENT ============
  const [currentScreen, setCurrentScreen] = useState('login'); // login, pos, dashboard, inventory
  const [currentUser, setCurrentUser] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // POS state
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [searchQuery, setSearchQuery] = useState('');

  // Inventory state
  const [inventory, setInventory] = useState([
    { id: 1, sku: 'COCA001', name: 'Coca-Cola 12oz', price: 2.49, stock: 45 },
    { id: 2, sku: 'PEPS001', name: 'Pepsi 12oz', price: 2.49, stock: 32 },
    { id: 3, sku: 'WATER001', name: 'Bottled Water 16oz', price: 1.99, stock: 120 },
    { id: 4, sku: 'SNACK001', name: 'Chips Bag', price: 3.99, stock: 28 },
    { id: 5, sku: 'SNACK002', name: 'Chocolate Bar', price: 1.49, stock: 65 },
    { id: 6, sku: 'CANDY001', name: 'Gummy Bears', price: 2.99, stock: 15 },
    { id: 7, sku: 'COFFEE001', name: 'Coffee K-Cup', price: 0.99, stock: 200 },
    { id: 8, sku: 'ENERGY001', name: 'Energy Drink', price: 3.49, stock: 42 },
  ]);

  // Mock employees database
  const employees = {
    'cashier1': { password: '1234', name: 'John Smith', role: 'Cashier' },
    'manager1': { password: '5678', name: 'Sarah Johnson', role: 'Manager' },
    'admin1': { password: 'admin', name: 'Alex Admin', role: 'Admin' },
  };

  // ============ LOGIN HANDLER ============
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    const employee = employees[loginUsername];
    if (!employee || employee.password !== loginPassword) {
      setLoginError('Invalid username or password');
      return;
    }

    const newShift = {
      id: Date.now(),
      clockInTime: new Date(),
      transactions: 0,
      totalSales: 0,
    };

    setCurrentUser(employee);
    setCurrentUser(prev => ({ ...prev, username: loginUsername }));
    setCurrentShift(newShift);
    setCurrentScreen('pos');
    setLoginUsername('');
    setLoginPassword('');
  };

  // ============ POS HANDLERS ============
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Calculate cart total
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]);

  const completeSale = () => {
    if (cartItems.length === 0) return;

    // Update inventory
    const newInventory = inventory.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          stock: Math.max(0, product.stock - cartItem.quantity)
        };
      }
      return product;
    });
    setInventory(newInventory);

    // Update shift stats
    setCurrentShift(prev => ({
      ...prev,
      transactions: prev.transactions + 1,
      totalSales: prev.totalSales + cartTotal,
    }));

    // Reset cart and go to dashboard
    setCartItems([]);
    setCartTotal(0);
    alert(`✅ Sale completed! $${cartTotal.toFixed(2)} - ${paymentMethod}\n\nInventory has been updated.`);
    setCurrentScreen('dashboard');
  };

  // ============ LOGOUT ============
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentShift(null);
    setCartItems([]);
    setCurrentScreen('login');
  };

  // ============ FILTERED PRODUCTS ============
  const filteredProducts = inventory.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============ LOGIN SCREEN ============
  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg mb-4">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Ledger Pro</h1>
            <p className="text-emerald-300 text-sm tracking-widest uppercase">Shift Management System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Employee ID</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            {/* Error */}
            {loginError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-red-300 text-sm">{loginError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition duration-200 mt-6"
            >
              Start Shift
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-3">Demo Credentials</p>
            <div className="space-y-2 text-sm text-slate-300">
              <p><span className="font-semibold text-emerald-300">Cashier:</span> cashier1 / 1234</p>
              <p><span className="font-semibold text-emerald-300">Manager:</span> manager1 / 5678</p>
              <p><span className="font-semibold text-emerald-300">Admin:</span> admin1 / admin</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ POS SCREEN ============
  if (currentScreen === 'pos' && currentUser) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Ledger Pro POS</h1>
              <p className="text-sm text-slate-600">Shift started: {currentShift?.clockInTime.toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-600 uppercase tracking-widest">Current User</p>
                <p className="text-lg font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-emerald-600">{currentUser.role}</p>
              </div>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentScreen('inventory')}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Inventory
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-3 gap-6">
          {/* Products */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Products</h2>
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`p-3 rounded-lg border-2 text-left transition ${
                      product.stock > 0
                        ? 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer'
                        : 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-sm text-slate-600">{product.sku}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-bold text-emerald-600">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-slate-600">Stock: {product.stock}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Cart
            </h2>
            
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-slate-600 text-center py-8">No items in cart</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-10 text-center border border-slate-300 rounded py-1"
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-lg">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="cash">💵 Cash</option>
                <option value="card">💳 Card</option>
                <option value="check">📄 Check</option>
              </select>
            </div>

            <button
              onClick={completeSale}
              disabled={cartItems.length === 0}
              className={`w-full py-3 font-bold rounded-lg transition ${
                cartItems.length > 0
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-300 text-slate-600 cursor-not-allowed'
              }`}
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ DASHBOARD ============
  if (currentScreen === 'dashboard' && currentUser) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentScreen('pos')}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Back to POS
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-4 gap-4 mb-8">
            {/* Transactions */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">Transactions</p>
                  <p className="text-4xl font-black text-slate-900">{currentShift?.transactions || 0}</p>
                </div>
                <ShoppingCart className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            {/* Total Sales */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">Total Sales</p>
                  <p className="text-4xl font-black text-emerald-600">${(currentShift?.totalSales || 0).toFixed(2)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-emerald-500 opacity-20" />
              </div>
            </div>

            {/* Avg Transaction */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">Avg Transaction</p>
                  <p className="text-4xl font-black text-slate-900">
                    ${currentShift?.transactions > 0 ? (currentShift.totalSales / currentShift.transactions).toFixed(2) : '0.00'}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-orange-500 opacity-20" />
              </div>
            </div>

            {/* Shift Duration */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-semibold mb-1">Shift Duration</p>
                  <p className="text-4xl font-black text-slate-900">
                    {Math.floor((Date.now() - currentShift?.clockInTime.getTime()) / 1000 / 60)} min
                  </p>
                </div>
                <Clock className="w-12 h-12 text-purple-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Low Stock Alert
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {inventory.filter(p => p.stock <= 20).map(product => (
                <div key={product.id} className="bg-white p-4 rounded-lg border border-amber-200">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-600 mb-2">{product.sku}</p>
                  <p className="text-2xl font-bold text-amber-600">{product.stock} left</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ INVENTORY ============
  if (currentScreen === 'inventory' && currentUser) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900">Inventory Management</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentScreen('pos')}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition"
              >
                Back to POS
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">SKU</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Product Name</th>
                  <th className="px-6 py-3 text-right text-sm font-bold text-slate-900">Price</th>
                  <th className="px-6 py-3 text-right text-sm font-bold text-slate-900">Current Stock</th>
                  <th className="px-6 py-3 text-center text-sm font-bold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {inventory.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-900">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">{product.stock}</td>
                    <td className="px-6 py-4 text-center">
                      {product.stock === 0 ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">OUT OF STOCK</span>
                      ) : product.stock <= 20 ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">LOW STOCK</span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">IN STOCK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LedgerProApp;
