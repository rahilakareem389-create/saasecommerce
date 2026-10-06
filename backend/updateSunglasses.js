const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateSunglasses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Designer Aviator Sunglasses' });
    
    if (product) {
      product.imageUrl = '/Designer Aviator Sunglasses/main.jpg';
      product.images = [
        '/Designer Aviator Sunglasses/513XTleJrJL._AC_UL480_FMwebp_QL65_.webp',
        '/Designer Aviator Sunglasses/61-03mngMNL._AC_SX569_.jpg',
        '/Designer Aviator Sunglasses/619I4ePlh2L._AC_SX569_.jpg',
        '/Designer Aviator Sunglasses/61d14-7xgsL._AC_SX679_.jpg',
        '/Designer Aviator Sunglasses/61dxjQk2+mL._AC_SX569_.jpg',
        '/Designer Aviator Sunglasses/61R-w52hlLL._AC_UL480_FMwebp_QL65_.webp',
        '/Designer Aviator Sunglasses/61SID0+kHxL._AC_SX569_.jpg'
      ];
      product.shortDescription = "Frame Material: Premium Lightweight Alloy\nLens Type: 100% UV Protection, Anti-Glare Polarized\nShape: Classic Aviator\nCare Instructions: Wipe clean with provided microfiber cloth";
      product.description = "ELEVATE YOUR STYLE: Discover the perfect blend of timeless design and modern functionality with our Designer Aviator Sunglasses. Crafted for those who appreciate sophisticated aesthetics, these sunglasses are an essential accessory for any season.\nPREMIUM LENSES: Featuring high-definition polarized lenses, these aviators offer 100% protection against harmful UVA and UVB rays. The anti-glare coating ensures crystal-clear vision even in the brightest conditions, making them ideal for driving, outdoor activities, or lounging by the beach.\nLIGHTWEIGHT & DURABLE: Constructed from a high-quality metal alloy, the frame is both incredibly durable and exceptionally lightweight. The adjustable silicone nose pads and flexible temple tips provide a customized, secure fit for all-day comfort without leaving pressure marks.\nCLASSIC SILHOUETTE: The iconic teardrop shape flatters a variety of face shapes, offering a universally appealing look for both men and women. The sleek double-bridge design adds a touch of vintage flair to your everyday wardrobe.\nWHAT'S INCLUDED: Your purchase comes complete with a premium protective hard case, a soft microfiber cleaning cloth, and a stylish storage pouch to keep your sunglasses safe and scratch-free when not in use.";
      
      await product.save();
      console.log('Successfully updated Designer Aviator Sunglasses!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateSunglasses();
