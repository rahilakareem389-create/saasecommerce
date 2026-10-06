const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateSweater = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Cozy Knit Sweater' });
    
    if (product) {
      product.imageUrl = '/Cozy Knit Sweater/main.jpg';
      product.images = [
        '/Cozy Knit Sweater/51om0lmJKIL._AC_SX569_.jpg',
        '/Cozy Knit Sweater/61AyJf+om+L._AC_SX569_.jpg',
        '/Cozy Knit Sweater/61iaHDXLEcL._AC_SX522_.jpg',
        '/Cozy Knit Sweater/71njUd9A-pL._AC_SX569_.jpg',
        '/Cozy Knit Sweater/71u2gUiw0gL._AC_SX522_.jpg'
      ];
      product.shortDescription = "Material: 50% Viscose, 25% Nylon, 25% Polyester\nDesign: Unisex Vintage Graphic, Oversized Streetwear Aesthetic\nCare: Machine Washable (Do not bleach)\nSeasons: Spring, Fall, Winter";
      product.description = "PREMIUM MATERIAL: Crafted from a carefully selected blend of 50% Viscose, 25% Nylon, and 25% Polyester. This knitted fabric is incredibly soft to the touch, highly comfortable for all-day wear, and designed to retain its shape without easily deforming over time.\nUNIQUE VINTAGE DESIGN: Embrace a standout look with this unisex vintage graphic sweater. It features a cozy, oversized streetwear silhouette that channels 90s fashion, chunky grunge aesthetics, and Japanese Harajuku styles. It's the perfect preppy Y2K long sleeve top for both men and women.\nVERSATILE OCCASIONS: This aesthetic knitted sweater is an excellent choice for a variety of occasions. Whether it's for daily wear, outerwear, office, school, shopping, dating, traveling, or holiday parties like Thanksgiving and Christmas, it keeps you warm and stylish throughout Spring, Fall, and Winter.\nEASY MATCHING: Creating a street-chic look is effortless. This pullover sweater pairs perfectly with your favorite jeans, cargo pants, leggings, sneakers, or other fashion accessories.\nWARM TIPS & CARE: This garment is machine washable for easy care. Please do not bleach. We highly recommend referring to the size information before purchasing to ensure the perfect oversized fit.";
      
      await product.save();
      console.log('Successfully updated Cozy Knit Sweater!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateSweater();
