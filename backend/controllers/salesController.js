const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const getSalesData = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: 'Cancelled' } }).populate('orderItems.product');
    
    let totalSales = 0;
    let totalRevenue = 0;
    let productsSold = 0;
    let totalOriginalValue = 0;
    
    // Time based filters
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let todaysSales = 0;
    let weeklySales = 0;
    let monthlySales = 0;

    // Category tracking
    const categorySales = {};
    const productSalesCount = {};
    
    let couponCount = 0;

    for (const order of orders) {
      totalSales++;
      totalRevenue += order.totalPrice;
      
      if (order.coupon) couponCount++;

      const orderDate = new Date(order.createdAt);
      if (orderDate >= today) todaysSales += order.totalPrice;
      if (orderDate >= firstDayOfWeek) weeklySales += order.totalPrice;
      if (orderDate >= firstDayOfMonth) monthlySales += order.totalPrice;

      for (const item of order.orderItems) {
        productsSold += item.qty;
        
        if (item.product) {
          totalOriginalValue += (item.product.price * item.qty);
          productSalesCount[item.product._id] = (productSalesCount[item.product._id] || 0) + item.qty;
          
          const product = await Product.findById(item.product._id).populate('category', 'name');
          if (product && product.category) {
            categorySales[product.category.name] = (categorySales[product.category.name] || 0) + item.qty;
          }
        } else {
          // If product deleted, use the stored price as original
          totalOriginalValue += (item.price * item.qty);
        }
      }
    }

    const discountGiven = Math.max(0, totalOriginalValue - totalRevenue);

    // Chart Data (Daily, Weekly, Monthly)
    const salesDaily = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      salesDaily[d.toLocaleDateString("en-US", { month: "short", day: "numeric" })] = 0;
    }
    
    const salesWeekly = {};
    for (let i = 3; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - (i * 7));
      salesWeekly["Week " + (4 - i)] = 0; // Simplified week label
    }

    const salesMonthly = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      salesMonthly[d.toLocaleDateString("en-US", { month: "short" })] = 0;
    }

    orders.forEach(order => {
      const d = new Date(order.createdAt);
      
      // Daily
      const dStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (salesDaily[dStr] !== undefined) salesDaily[dStr] += order.totalPrice;
      
      // Monthly
      const mStr = d.toLocaleDateString("en-US", { month: "short" });
      if (salesMonthly[mStr] !== undefined) salesMonthly[mStr] += order.totalPrice;
      
      // Weekly (naive approach: just bucket by difference in weeks from now)
      const diffTime = Math.abs(new Date() - d);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays <= 7) salesWeekly["Week 4"] += order.totalPrice;
      else if (diffDays <= 14) salesWeekly["Week 3"] += order.totalPrice;
      else if (diffDays <= 21) salesWeekly["Week 2"] += order.totalPrice;
      else if (diffDays <= 28) salesWeekly["Week 1"] += order.totalPrice;
    });

    const chartDataDaily = Object.keys(salesDaily).map(k => ({ name: k, sales: salesDaily[k] }));
    const chartDataWeekly = Object.keys(salesWeekly).map(k => ({ name: k, sales: salesWeekly[k] }));
    const chartDataMonthly = Object.keys(salesMonthly).map(k => ({ name: k, sales: salesMonthly[k] }));

    // Category Chart
    const categoryChartData = Object.keys(categorySales).map(key => ({
      name: key,
      value: categorySales[key]
    }));

    // Top Selling Products
    const topProductIds = Object.keys(productSalesCount).sort((a, b) => productSalesCount[b] - productSalesCount[a]).slice(0, 5);
    const topProductsList = await Promise.all(topProductIds.map(async id => {
      const p = await Product.findById(id).select('title imageUrl price');
      return p ? { ...p.toObject(), totalSold: productSalesCount[id] } : null;
    }));
    const topProducts = topProductsList.filter(Boolean);

    res.json({
      overview: {
        totalSales,
        totalRevenue,
        todaysSales,
        weeklySales,
        monthlySales,
        productsSold,
        discountGiven,
        couponCount
      },
      chartDataDaily,
      chartDataWeekly,
      chartDataMonthly,
      categoryChartData,
      topProducts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching sales data' });
  }
};

module.exports = { getSalesData };

