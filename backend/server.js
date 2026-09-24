require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for dev
  },
});

app.use(cors());
app.use(express.json());

// Ensure MongoDB Connection for Serverless
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-store');
    next();
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    res.json({
      status: 'ok',
      dbState: mongoose.connection.readyState,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      dbState: mongoose.connection.readyState,
      errorName: err.name,
      errorMessage: err.message,
      errorCode: err.code
    });
  }
});

// Models
const Product = require('./models/Product');
const Order = require('./models/Order');
const Category = require('./models/Category');
const Coupon = require('./models/Coupon');
const User = require('./models/User');

// Import Routes
const { protect, admin } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);

// Dashboard and Sales Routes
const { getDashboardData } = require('./controllers/dashboardController');
const { getSalesData } = require('./controllers/salesController');
const Settings = require('./models/Settings');

app.get('/api/dashboard', protect, admin, getDashboardData);
app.get('/api/sales', protect, admin, getSalesData);

// Settings Routes
app.get('/api/test-email', async (req, res) => {
  try {
    const sendEmail = require('./utils/sendEmail');
    await sendEmail({
      email: 'wordpressrahila@gmail.com',
      subject: 'Test Email from Railway Server',
      html: '<p>This is a test email sent directly from the Railway server environment.</p>'
    });
    res.json({ success: true, message: 'Email sent successfully from Railway!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || error.toString() });
  }
});

app.get('/api/settings', protect, admin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/settings', protect, admin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    
    // Update fields dynamically
    Object.keys(req.body).forEach(key => {
      settings[key] = req.body[key];
    });
    
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Category Routes
app.get('/api/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});
app.post('/api/categories', protect, admin, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/api/categories/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.delete('/api/categories/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (category) {
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      const prodObj = product.toObject();
      prodObj.reviews = prodObj.reviews.filter(r => r.status === 'Approved');
      res.json(prodObj);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/products/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
      if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        status: 'Pending'
      };

      product.reviews.push(review);
      await product.save();
      res.status(201).json({ message: 'Review added and pending approval' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Review Management Routes
app.get('/api/reviews', protect, admin, async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } }).select('title reviews');
    let allReviews = [];
    products.forEach(p => {
      p.reviews.forEach(r => {
        allReviews.push({
          ...r.toObject(),
          productId: p._id,
          productName: p.title
        });
      });
    });
    // Sort by newest first
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/reviews/:productId/:reviewId/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.status = status;

    // Recalculate rating based on APPROVED reviews
    const approvedReviews = product.reviews.filter(r => r.status === 'Approved');
    product.numReviews = approvedReviews.length;
    product.rating = approvedReviews.length > 0 
      ? approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length 
      : 0;

    await product.save();
    res.json({ message: 'Review status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/reviews/:productId/:reviewId', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.reviews.pull({ _id: req.params.reviewId });

    // Recalculate rating based on APPROVED reviews
    const approvedReviews = product.reviews.filter(r => r.status === 'Approved');
    product.numReviews = approvedReviews.length;
    product.rating = approvedReviews.length > 0 
      ? approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length 
      : 0;

    await product.save();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer My Reviews
app.get('/api/users/myreviews', protect, async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.user': req.user._id }).select('title imageUrl reviews');
    let myReviews = [];
    products.forEach(p => {
      p.reviews.forEach(r => {
        if (r.user.toString() === req.user._id.toString()) {
          myReviews.push({
            ...r.toObject(),
            productId: p._id,
            productName: p.title,
            productImage: p.imageUrl
          });
        }
      });
    });
    myReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(myReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    let categoryId = req.body.category;
    
    // Fallback: If no category is provided, find or create a 'General' category
    if (!categoryId) {
      let defaultCat = await Category.findOne({ slug: 'general' });
      if (!defaultCat) {
        defaultCat = await Category.create({ name: 'General', slug: 'general' });
      }
      categoryId = defaultCat._id;
    }

    const productData = {
      ...req.body,
      category: categoryId,
      stock: req.body.stock || 0
    };

    const product = new Product(productData);
    await product.save();
    
    io.emit('new_product', product);
    
    const totalProducts = await Product.countDocuments();
    io.emit('kpi_update', { totalProducts });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category', 'name');
    if (product) {
      io.emit('update_product', product);
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/products/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      io.emit('delete_product', req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/kpis', async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  
  const orders = await Order.find();
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  res.json({ totalProducts, totalOrders, totalRevenue });
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    
    // Update product stock and emit updates
    for (const item of order.orderItems) {
      if (item.product) {
        const product = await Product.findById(item.product).populate('category', 'name');
        if (product) {
          product.stock = Math.max(0, product.stock - item.qty);
          await product.save();
          io.emit('update_product', product);
        }
      }
    }

    // If coupon used, increment usage
    if (req.body.coupon) {
      const usedCoupon = await Coupon.findOne({ code: req.body.coupon.toUpperCase() });
      if (usedCoupon) {
        usedCoupon.usedCount += 1;
        await usedCoupon.save();
      }
    }

    // Send Real-time Email
    const sendEmail = require('./utils/sendEmail');
    const orderItemsHtml = order.orderItems.map(item => `<li>${item.qty}x ${item.name} ($${item.price})</li>`).join('');
    
    sendEmail({
      email: 'wordpressrahila@gmail.com',
      subject: `New Order Received! #${order._id.toString().substring(order._id.toString().length - 8).toUpperCase()}`,
      html: `
        <h2>New Order Placed!</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total Amount:</strong> $${order.totalPrice.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <h3>Customer Details:</h3>
        <p>Name: ${order.shippingAddress.address.split(',')[0]} (Assuming name is in address, check dashboard for details)</p>
        <p>City: ${order.shippingAddress.city}</p>
        <p>Country: ${order.shippingAddress.country}</p>
        <h3>Items:</h3>
        <ul>${orderItemsHtml}</ul>
        <br/>
        <p>Log in to the Admin Dashboard to process this order.</p>
      `
    }).catch(err => console.error('Background email failed:', err));

    // Emit real-time event
    io.emit('new_order', order);
    
    // Emit updated KPI
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    
    io.emit('kpi_update', { totalOrders, totalRevenue });
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Customer Management Routes
app.get('/api/customers', protect, admin, async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').lean();
    
    // Add stats for each customer
    for (let c of customers) {
      const orders = await Order.find({ user: c._id });
      c.totalOrders = orders.length;
      c.totalSpent = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    }
    
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:id', protect, admin, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password').lean();
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 });
    customer.ordersList = orders;
    customer.totalOrders = orders.length;
    customer.pendingOrders = orders.filter(o => o.status === 'Pending').length;
    customer.completedOrders = orders.filter(o => o.status === 'Delivered').length;
    customer.cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
    customer.totalSpent = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id/status', protect, admin, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    customer.status = customer.status === 'Active' ? 'Blocked' : 'Active';
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
// Trigger automatic Vercel redeploy
