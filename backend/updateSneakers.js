const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateSneakers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Classic White Sneakers' });
    
    if (product) {
      product.imageUrl = '/Classic White Sneakers/main.jpg';
      product.images = [
        '/Classic White Sneakers/710hNb7Wz1L._AC_SY575_.jpg',
        '/Classic White Sneakers/717GcLexjvL._AC_SY575_.jpg',
        '/Classic White Sneakers/7180YXLPtsL._AC_SY575_.jpg',
        '/Classic White Sneakers/71jv7ewmR4L._AC_SY575_.jpg',
        '/Classic White Sneakers/71sIV8Y3NtL._AC_SY575_.jpg'
      ];
      product.shortDescription = "Style: Iconic Retro 80s Tennis Shoe\nMaterial: Leather Upper, Durable Rubber Sole\nSport Type: Tennis / Casual\nClosure Type: Lace-Up";
      product.description = "ICONIC STYLE: The timeless tennis shoes for men never go out of fashion. Popular for their exceptional comfort, durability, and old school 80s look, these lightweight men's sneakers are the pair you'll wear every day.\nLEATHER UPPER: The leather upper on these hip mens shoes are durable and easy to wipe clean. Classic white tennis shoes have never been this comfortable!\nDURABLE RUBBER SOLE: Providing excellent traction with a high abrasion outsole and a die cut EVA midsole to absorb impact, our cool men's fashion sneakers also double as all-day walking shoes and can be paired with anything from jeans to khakis.\nSUPERIOR COMFORT: The padded low cut collar and removable foam sock liner are cushioned with soft terry. Not your average white sneakers for men, this style elevates your everyday look with a trendy retro vibe.\nCLEAN, MINIMALIST DESIGN: Our most comfy shoes for men also happen to be our most stylish. Dedicated to bringing men footwear that is cross functional and fits the active lifestyle of a man on the go.\n\nFEATURES & SPECS:\n- Shoe Type: Athletic Shoe / Tennis\n- Closure & Strap Type: Lace-Up\n- Cushioning Level: Moderate (Foam Insole Cushioning)\n- Water Resistance: Not Water Resistant";
      
      await product.save();
      console.log('Successfully updated Classic White Sneakers!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateSneakers();
