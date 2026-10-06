const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateTee = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Graphic Print Tee' });
    
    if (product) {
      product.imageUrl = '/Graphic Print Tee/main.jpg';
      product.images = [
        '/Graphic Print Tee/714zFpM+dTL._AC_SX466_.jpg',
        '/Graphic Print Tee/71JUSvpBPEL._AC_SY550_.jpg',
        '/Graphic Print Tee/71kSqUpOtEL._AC_SY550_.jpg',
        '/Graphic Print Tee/81a7wID8n6L._AC_SY550_.jpg'
      ];
      product.shortDescription = "Fabric type: Cotton blend\nCare instructions: Machine Washable, hand wash gently in normal temperature water, don't bleach or wash with hot water.\nOrigin: Imported\nClosure type: Cotton blend";
      product.description = "Fabric: This western graphic shirt for women is made of cotton blend fabric, soft and breathable, comfortable for all day wear.\nFeatures: Oversized country music shirt,Nashville Music City T-Shirt, Country Music Oversized Shirts for Women, Vintage Guitar Wings Graphic Tees, Rock Band Tops, Nashville Vintage Style Tshirt, Concert Short Sleeve Shirts. Show Off Your Love for Music City and Rock Music In Style!\nVersatile: This vintage tee is a must-have lady's top in your wardrobe. It is easy to match with your favorite shorts, jeans, dress, skirts, leggings, high heels, boots in daily life.\nOccasions: Suit For Concert, Festival, Country Music Party, Drinking Party, Date, Shopping, Beach, Vacation, Casual, School, Party, Work, Outdoor, Holiday, Travel, Daily Wear Etc. Great to Wear as Casual Street Style T-shirt.\nWashing Instructions: Machine Washable, Recommend Hand Wash Gently In Normal Temperature Water, Don't Bleach Or Washed With Hot Water.";
      
      await product.save();
      console.log('Successfully updated Graphic Print Tee!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateTee();
