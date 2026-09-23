const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

const getDashboardData = async (req, res) => {
  try {
    // 1. KPI Counts
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const completedOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
    
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });

    // Calculate total revenue and total sales (items sold)
    const orders = await Order.find().populate('orderItems.product');
    let totalRevenue = 0;
    let totalSales = 0; // total quantity of items sold
    
    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        totalRevenue += order.totalPrice;
        order.orderItems.forEach(item => {
          totalSales += item.qty;
        });
      }
    });

    // 2. Charts Data
    // Sales and Revenue Chart (Group by Date)
    const salesByDate = {};
    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!salesByDate[date]) {
          salesByDate[date] = { name: date, revenue: 0, sales: 0 };
        }
        salesByDate[date].revenue += order.totalPrice;
        order.orderItems.forEach(item => {
          salesByDate[date].sales += item.qty;
        });
      }
    });
    const revenueChartData = Object.values(salesByDate).slice(-7); // Last 7 days

    // Orders Overview (Status Pie Chart)
    const ordersOverviewData = [
      { name: 'Pending', value: pendingOrders },
      { name: 'Processing', value: await Order.countDocuments({ status: 'Processing' }) },
      { name: 'Shipped', value: await Order.countDocuments({ status: 'Shipped' }) },
      { name: 'Delivered', value: completedOrders },
      { name: 'Cancelled', value: cancelledOrders },
    ];

    // Category-wise sales
    const categorySales = {};
    for (const order of orders) {
      if (order.status !== 'Cancelled') {
        for (const item of order.orderItems) {
          if (item.product) {
            const product = await Product.findById(item.product).populate('category');
            if (product && product.category) {
              const catName = product.category.name;
              categorySales[catName] = (categorySales[catName] || 0) + item.qty;
            }
          }
        }
      }
    }
    const categoryChartData = Object.keys(categorySales).map(key => ({
      name: key,
      value: categorySales[key]
    }));

    // 3. Lists
    // Top-selling products
    const productSales = {};
    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        order.orderItems.forEach(item => {
          if (item.product) {
            productSales[item.product._id] = (productSales[item.product._id] || 0) + item.qty;
          }
        });
      }
    });
    
    // Sort and get top 5 products
    const topProductIds = Object.keys(productSales).sort((a, b) => productSales[b] - productSales[a]).slice(0, 5);
    const topProductsList = await Promise.all(topProductIds.map(async id => {
      const p = await Product.findById(id).select('title imageUrl price stock');
      if (p) {
        return { ...p.toObject(), totalSold: productSales[id] };
      }
      return null;
    }));
    const topProducts = topProductsList.filter(p => p !== null);

    // Recent orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

    res.json({
      kpis: {
        totalRevenue,
        totalSales,
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        lowStockProducts
      },
      charts: {
        revenueChartData,
        ordersOverviewData,
        categoryChartData
      },
      lists: {
        topProducts,
        recentOrders
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

module.exports = { getDashboardData };
