const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateWatch = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Classic Chronograph Watch' });
    
    if (product) {
      product.imageUrl = '/Classic Chronograph Watch/main.jpg';
      product.images = [
        '/Classic Chronograph Watch/713W3vTskuL._AC_SY535_.jpg',
        '/Classic Chronograph Watch/71kgISt8FBL._AC_SY535_.jpg',
        '/Classic Chronograph Watch/71Mq3Bh8HSL._AC_SY535_.jpg',
        '/Classic Chronograph Watch/71uD4iUlQlL._AC_SY535_.jpg'
      ];
      product.shortDescription = "Movement: Precise Japanese Quartz Chronograph\nMaterial: Premium 316L Stainless Steel Case & Genuine Leather Strap\nWater Resistance: 50m (5 ATM)\nFeatures: Stopwatch, Date Display, Luminous Hands";
      product.description = "ELEGANT & FUNCTIONAL DESIGN: Make a bold statement with our Classic Chronograph Watch. Designed for the modern gentleman, this timepiece perfectly balances traditional watchmaking aesthetics with contemporary functionality. Whether you're in the boardroom or at a casual weekend gathering, this watch is the perfect companion to elevate any outfit.\nPREMIUM CRAFTSMANSHIP: Built to last, the watch features a robust 316L stainless steel case that protects the precise Japanese quartz movement inside. The scratch-resistant hardened mineral crystal glass ensures your dial remains pristine and easy to read, while the genuine, supple leather strap provides ultimate comfort and durability for daily wear.\nMULTIFUNCTION CHRONOGRAPH: The sophisticated dial includes three functional sub-dials that operate as a stopwatch (measuring minutes, seconds, and 1/10th of a second), alongside a convenient date window at the 4 o'clock position. The luminescent hands and hour markers allow for clear visibility in low-light conditions.\nWATER RESISTANT: With a water resistance rating of 50 meters (5 ATM), this watch is designed to withstand splashes, brief immersion in water, and rain. (Note: Not suitable for showering, bathing, swimming, snorkeling, or diving).\nPERFECT GIFT: Packaged in a luxurious presentation box, this Classic Chronograph Watch makes an exceptional gift for birthdays, anniversaries, graduations, or Father's Day. Each watch comes with a comprehensive user manual and a standard 1-year warranty for your peace of mind.";
      
      await product.save();
      console.log('Successfully updated Classic Chronograph Watch!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateWatch();
