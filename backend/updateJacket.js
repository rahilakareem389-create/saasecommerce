const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateJacket = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Classic Denim Jacket' });
    
    if (product) {
      product.imageUrl = '/Classic Denim Jacket/main.jpg';
      product.images = [
        '/Classic Denim Jacket/71IEQEwzcFL._AC_SY550_.jpg',
        '/Classic Denim Jacket/71lbvx34cJL._AC_SY550_.jpg',
        '/Classic Denim Jacket/81+yEVAZ3cL._AC_SY550_.jpg',
        '/Classic Denim Jacket/81C2GrBOqbL._AC_SY550_.jpg',
        '/Classic Denim Jacket/81euXfj5lnL._AC_SY550_.jpg',
        '/Classic Denim Jacket/81GZ8u39YHL._AC_SY550_.jpg',
        '/Classic Denim Jacket/913sL+OvALL._AC_SY550_.jpg',
        '/Classic Denim Jacket/91ejursbGeL._AC_SX466_.jpg'
      ];
      product.shortDescription = "Fabric type: Denim\nCare instructions: Machine Wash\nOrigin: Made in the USA and Imported";
      product.description = "PERFECT FIT: Argstar denim jacket is designed in a regular fit, hitting just below the natural waist for a relaxed look. The stretch denim fabric provides comfort and flexibility.\nTIMELESS STYLE: Make a statement in a high-quality jean jacket inspired by the western lifestyle. Express your true, authentic self through timeless pieces by Argstar.\nICONIC DETAILS: collared neckline design, button down closure, two flap chest pockets and side pockets, single breasted jacket. Casual fashion jean jackets for women.\nALL-DAY COMFORT: Made from a soft cotton blend, this womens denim jacket is designed to provide comfort and mobility all day long.\nVERSATILE WEAR: Argstar classic denim jacket is perfect for cool evenings or days, clubs, party, work office, winter holidays, going out, outdoors, leisure, night out, back to school, etc.";
      
      await product.save();
      console.log('Successfully updated Classic Denim Jacket!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateJacket();
