const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateDress = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Floral Wrap Maxi Dress' });
    
    if (product) {
      product.imageUrl = '/Floral Wrap Maxi Dress/main.jpg';
      product.images = [
        '/Floral Wrap Maxi Dress/71s-06J4MnL._AC_SY550_.jpg',
        '/Floral Wrap Maxi Dress/91dLsnYoE1L._AC_SY550_.jpg',
        '/Floral Wrap Maxi Dress/91jg-3C7pqL._AC_SY550_.jpg'
      ];
      product.shortDescription = "Material: 100% Polyester Chiffon (Shell & Lining)\nFeatures: Wrap V-Neckline, Sheer Lantern Long Sleeves\nStyle: Vintage-Inspired Bohemian Floral A-Line Maxi\nFit: Tie-Back Belt for Flattering Silhouette";
      product.description = "PREMIUM CHIFFON MATERIAL: Crafted from 100% Polyester Chiffon for both the outer shell and inner lining. This lightweight, soft, and highly breathable women's dress feels incredibly gentle against the skin all day long, making it perfectly suited for all seasons.\nFLATTERING BOHO DESIGN: Featuring a deeply flattering wrap V-neckline and romantic sheer lantern long sleeves, this elegant dress is designed to accentuate your figure beautifully. The eye-catching floral pattern gives it a stunning vintage-inspired Bohemian look.\nELEGANT SILHOUETTE: The tiered A-line skirt flows gracefully with every single step you take. Meanwhile, the adjustable tie-back belt cinches the waist perfectly, creating a beautiful and defined A-line silhouette that flatters all body types.\nVERSATILE FASHION CLOTHING: This stunning floral maxi dress is a must-have wardrobe staple. It serves perfectly as a wedding guest dress, maternity dress, elegant cocktail attire, beach vacation wear, or even for stylish early fall fashion and holiday gatherings.\nPERFECT FOR ANY OCCASION: Pair it effortlessly with high heels and a sun hat for a complete look. It's the ideal outfit for the beach, vacations, tea parties, cruises, bridal showers, baby showers, church, graduations, or festive holidays like Easter, Valentine's Day, Thanksgiving, and Christmas.";
      
      await product.save();
      console.log('Successfully updated Floral Wrap Maxi Dress!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateDress();
