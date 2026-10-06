const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateGown = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Classic Evening Gown' });
    
    if (product) {
      product.imageUrl = '/Classic Evening Gown/main.jpg';
      product.images = [
        '/Classic Evening Gown/61IterCInzL._AC_SY741_.jpg',
        '/Classic Evening Gown/61T3Z4qM2CL._AC_SX569_.jpg',
        '/Classic Evening Gown/61yOfq9ZSeL._AC_SX569_.jpg'
      ];
      product.shortDescription = "Fabric: Bodice: 95% Polyester, 5% Spandex / Skirt: 100% Polyester (Ombre Satin)\nFeatures: V-Neck Back, Concealed Pockets, Decorative Front Bow\nFit: True to Size, Stretch Top with 3/4 Sleeves\nClosure: Zipper";
      product.description = "ELEGANT STYLING: Make a grand entrance with this stunning floor-length formal gown. Featuring a beautiful V-neck back, a decorative front bow detail, and a luxurious ombre satin skirt, this dress creates an unforgettably sophisticated look perfect for weddings, galas, and special events.\nFLATTERING FIT DETAILS: Designed to fit true to size, this fully lined, figure-flattering gown ensures you look your absolute best. The comfortable stretch knit top combined with 3/4 sleeves and an elegant pleated design makes it perfectly suited for various body types and comfortable enough for all-night wear at any black-tie affair.\nFUNCTIONAL & CHIC FEATURES: We believe elegance shouldn't compromise convenience. This beautiful evening dress features a stretch top, a self-tie belt to cinch the waist, and brilliant concealed pockets that perfectly combine practicality with high-end fashion.\nPREMIUM FABRIC & CARE: The bodice is crafted from a comfortable stretch knit fabric (95% Polyester, 5% Spandex) that moves with you, while the 100% Polyester ombre satin ballgown skirt provides graceful movement and undeniable sophistication. Care Instructions: Hand wash cold separately, do not bleach, lay flat to dry, cool iron as needed, or dry clean for best results.\nSIZE GUIDE: Length from top of shoulder to bottom hem is approximately 61\". Please refer to our detailed size chart before ordering to ensure the perfect fit.";
      
      await product.save();
      console.log('Successfully updated Classic Evening Gown!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateGown();
