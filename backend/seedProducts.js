const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const seedProducts = async () => {
  try {
    // Clear existing
    await Product.deleteMany();
    await Category.deleteMany();

    // Create Categories
    const catElectronics = await Category.create({ name: 'Electronics', slug: 'electronics', description: 'Gadgets and Devices' });
    const catClothing = await Category.create({ name: 'Clothing', slug: 'clothing', description: 'Apparel and Fashion' });
    const catHome = await Category.create({ name: 'Home & Living', slug: 'home-and-living', description: 'Furniture and Decor' });

    // Products Array
    const products = [
      {
        title: 'Apple iPhone 15 Pro Max',
        description: 'The latest iPhone with A17 Pro chip, titanium design, and an advanced camera system.',
        price: 1199.99,
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
        category: catElectronics._id,
        stock: 50,
        status: 'Active',
        isFeatured: true
      },
      {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry leading noise canceling headphones with Auto NC Optimizer.',
        price: 398.00,
        salePrice: 348.00, // Discount
        imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop',
        category: catElectronics._id,
        stock: 120,
        status: 'Active',
        isFeatured: true
      },
      {
        title: 'Men\'s Premium Cotton T-Shirt',
        description: 'Super soft, breathable 100% cotton crew neck t-shirt. Perfect for everyday wear.',
        price: 25.99,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
        category: catClothing._id,
        stock: 200,
        status: 'Active',
        isFeatured: false
      },
      {
        title: 'Minimalist Leather Wallet',
        description: 'Slim RFID blocking leather wallet for men and women. Fits perfectly in the front pocket.',
        price: 45.00,
        imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
        category: catClothing._id,
        stock: 75,
        status: 'Active',
        isFeatured: false
      },
      {
        title: 'Modern Ceramic Coffee Mug',
        description: 'Handcrafted ceramic mug with a beautiful matte finish. Holds 12oz.',
        price: 18.50,
        imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
        category: catHome._id,
        stock: 30,
        status: 'Active',
        isFeatured: true
      },
      {
        title: 'Smart LED Desk Lamp',
        description: 'Dimmable LED desk lamp with USB charging port and adjustable color temperature.',
        price: 55.00,
        salePrice: 45.00,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
        category: catHome._id,
        stock: 0, // Out of stock example
        status: 'Out of Stock',
        isFeatured: false
      }
    ];

    await Product.insertMany(products);
    console.log('Successfully seeded Categories and Products!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedProducts();
