const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateDress = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Elegant Summer Midi Dress' });
    
    if (product) {
      product.imageUrl = '/Elegant Summer Midi Dress/main.jpg';
      product.images = [
        '/Elegant Summer Midi Dress/61b29Bnd1jL._AC_SY550_.jpg',
        '/Elegant Summer Midi Dress/61jeGJPQutL._AC_SY550_.jpg',
        '/Elegant Summer Midi Dress/61sVkIjYV+L._AC_SY741_.jpg',
        '/Elegant Summer Midi Dress/71idY1MyTTL._AC_SY550_.jpg',
        '/Elegant Summer Midi Dress/71K87lgH3uL._AC_SY550_.jpg',
        '/Elegant Summer Midi Dress/71qRpNJD-DL._AC_SY550_.jpg'
      ];
      product.shortDescription = "Material: 100% Viscose (Soft, stretchy, lightweight)\nFeatures: Sleeveless, Crew Neck, High Waist, Midi Length\nStyle: A-Line, Flattering Hourglass Shape\nCare: Hand Wash Recommended";
      product.description = "PREMIUM MATERIAL: Our summer dresses are expertly crafted from 100% Viscose. This high-quality material is incredibly soft to the touch, comfortably stretchy, and features a lightweight feel with a beautiful, natural drape that moves with you.\nFLATTERING FEATURES: Designed with an elegant sleeveless cut and a classic crew neck. The dress showcases a sophisticated pleated design, a defining high waist, and a chic midi length. The beautiful A-Line style paired with the high-waisted design effortlessly creates a highly flattering, stunning hourglass shape.\nVERSATILE OCCASIONS: These spring classy casual midi dresses are the absolute perfect choice for a wide variety of events. Wear it confidently for work, office, business casual meetings, church, dinners, graduations, nights out, cocktail parties, as a wedding guest, on dates, engagements, cruises, or relaxing holidays.\nEASY TO MATCH: Styling is a breeze. This knit cocktail tank dress can be elegantly worn with your favorite pumps for a chic, sophisticated look, or paired with comfortable sandals for a breezy, casual beach look in the summer. It also transitions beautifully into cooler weather—just match it with any of your beloved fall jackets or coats.\nWASHING CARE & SIZING: To keep this fashionable women's dress in top condition, we strongly recommend hand washing. Please hang or line dry, and do not bleach. Available in a wide range of sizes (XS=US 0-2, S=US 4-6, M=US 8-10, L=US 12-14, XL=US 16-18, XXL=US 20).";
      
      await product.save();
      console.log('Successfully updated Elegant Summer Midi Dress!');
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
