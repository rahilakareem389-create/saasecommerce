const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Store Settings
  storeName: { type: String, default: 'My E-Commerce Store' },
  storeEmail: { type: String, default: 'admin@store.com' },
  phoneNumber: { type: String, default: '+1 234 567 8900' },
  storeAddress: { type: String, default: '123 Commerce St, NY' },
  storeLogo: { type: String, default: '' },
  
  // Payment Settings
  codEnabled: { type: Boolean, default: true },
  onlinePaymentEnabled: { type: Boolean, default: false },
  
  // Shipping Settings
  shippingCharges: { type: Number, default: 10 },
  freeShippingThreshold: { type: Number, default: 100 },
  freeShippingEnabled: { type: Boolean, default: false },
  
  // Tax Settings
  taxPercentage: { type: Number, default: 0 },
  taxEnabled: { type: Boolean, default: false },
  
  // Currency Settings
  currency: { type: String, default: 'USD' },
  
  // Notification Settings
  notifyNewOrder: { type: Boolean, default: true },
  notifyLowStock: { type: Boolean, default: true },
  notifyNewCustomer: { type: Boolean, default: true },
  
  // Website Settings
  maintenanceMode: { type: Boolean, default: false },
  productsPerPage: { type: Number, default: 12 },
  reviewsEnabled: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
