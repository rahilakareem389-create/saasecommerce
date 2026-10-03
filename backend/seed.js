const mongoose = require('mongoose');

const seedDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
    console.log('Connected to DB for seeding');

    const Category = require('./models/Category');
    const Product = require('./models/Product');
    

    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Old products and categories deleted.');

    // 5 Categories
    const categories = await Category.insertMany([
      { name: 'DRESSES', slug: 'dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
      { name: 'OUTERWEAR', slug: 'outerwear', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80' },
      { name: 'ACCESSORIES', slug: 'accessories', image: 'https://images.unsplash.com/photo-1599643478524-fb66f7240078?w=500&q=80' },
      { name: 'SHOES', slug: 'shoes', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80' },
      { name: 'TOPS', slug: 'tops', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' }
    ]);
    
    console.log('Categories seeded.');

    // Create 4 products for each category
    const productsData = [
      // Dresses
      { title: 'Elegant Summer Midi Dress', price: 49.99, category: categories[0]._id, description: 'A beautiful midi dress perfect for summer evenings and casual outings.', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80', countInStock: 20 },
      { title: 'Floral Wrap Maxi Dress', price: 59.99, category: categories[0]._id, description: 'Flowy floral wrap dress with a flattering silhouette.', imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&q=80', countInStock: 15 },
      { title: 'Classic Evening Gown', price: 129.99, category: categories[0]._id, description: 'Elegant evening gown for formal events.', imageUrl: 'https://images.unsplash.com/photo-1566160983808-c89b3ab72017?w=500&q=80', countInStock: 5 },
      { title: 'Casual Cotton Sundress', price: 39.99, category: categories[0]._id, description: 'Lightweight and breathable cotton sundress.', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80', countInStock: 25 },
      // Outerwear
      { title: 'Classic Denim Jacket', price: 69.99, category: categories[1]._id, description: 'Timeless denim jacket, a staple for any wardrobe.', imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80', countInStock: 30 },
      { title: 'Premium Leather Biker Jacket', price: 149.99, category: categories[1]._id, description: 'Genuine leather biker jacket with premium hardware.', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80', countInStock: 10 },
      { title: 'Winter Wool Coat', price: 119.99, category: categories[1]._id, description: 'Warm and stylish wool coat for cold winter days.', imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&q=80', countInStock: 12 },
      { title: 'Lightweight Windbreaker', price: 45.99, category: categories[1]._id, description: 'Sporty windbreaker for outdoor activities.', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80', countInStock: 40 },
      // Accessories
      { title: 'Leather Crossbody Bag', price: 55.00, category: categories[2]._id, description: 'Compact and stylish genuine leather crossbody bag.', imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80', countInStock: 18 },
      { title: 'Designer Aviator Sunglasses', price: 29.99, category: categories[2]._id, description: 'Classic aviator sunglasses with UV protection.', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80', countInStock: 50 },
      { title: 'Classic Chronograph Watch', price: 89.99, category: categories[2]._id, description: 'Elegant mens watch with leather strap.', imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80', countInStock: 8 },
      { title: 'Minimalist Gold Necklace', price: 34.99, category: categories[2]._id, description: 'Delicate 18k gold plated minimalist necklace.', imageUrl: 'https://images.unsplash.com/photo-1599643478524-fb66f7240078?w=500&q=80', countInStock: 22 },
      // Shoes
      { title: 'Comfortable Running Shoes', price: 75.00, category: categories[3]._id, description: 'High-performance running shoes with breathable mesh.', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', countInStock: 35 },
      { title: 'Classic White Sneakers', price: 60.00, category: categories[3]._id, description: 'Versatile white sneakers that go with any outfit.', imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', countInStock: 45 },
      { title: 'Leather Oxford Shoes', price: 95.00, category: categories[3]._id, description: 'Formal leather oxford shoes for professional wear.', imageUrl: 'https://images.unsplash.com/photo-1614252339474-115f53d82a17?w=500&q=80', countInStock: 15 },
      { title: 'Summer Ankle Boots', price: 85.00, category: categories[3]._id, description: 'Stylish ankle boots suitable for summer and fall.', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80', countInStock: 20 },
      // Tops
      { title: 'Basic V-Neck T-Shirt', price: 15.99, category: categories[4]._id, description: 'Essential v-neck t-shirt made from soft cotton.', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', countInStock: 100 },
      { title: 'Silk Button-Up Blouse', price: 45.00, category: categories[4]._id, description: 'Elegant silk blouse for a sophisticated look.', imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80', countInStock: 25 },
      { title: 'Cozy Knit Sweater', price: 55.00, category: categories[4]._id, description: 'Warm and chunky knit sweater for chilly days.', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80', countInStock: 30 },
      { title: 'Graphic Print Tee', price: 22.50, category: categories[4]._id, description: 'Trendy graphic print t-shirt with unique design.', imageUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&q=80', countInStock: 60 }
    ];

    await Product.insertMany(productsData);
    console.log('Products seeded.');

    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();




