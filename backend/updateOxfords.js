const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateOxfords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Leather Oxford Shoes' });
    
    if (product) {
      product.imageUrl = '/Leather Oxford Shoes/main.jpg';
      product.images = [
        '/Leather Oxford Shoes/71+Y-h15Y8L._AC_SY575_.jpg',
        '/Leather Oxford Shoes/71Fi6kAyieL._AC_SY575_.jpg',
        '/Leather Oxford Shoes/71h9pOXO8FL._AC_SY575_.jpg',
        '/Leather Oxford Shoes/71HUPkQCWNL._AC_SY575_.jpg',
        '/Leather Oxford Shoes/71kos1N9nlL._AC_SY575_.jpg',
        '/Leather Oxford Shoes/71XT1WIyS7L._AC_SY695_.jpg'
      ];
      product.shortDescription = "Material: Premium Genuine Leather Upper\nTechnology: truTECH Shock-Absorbing Cushioning\nInsoles: Removable for Orthotic Compatibility\nFit: Extended Sizes and Widths Available";
      product.description = "GENUINE LEATHER CRAFTSMANSHIP: Elevate your professional attire with our premium leather oxford shoes. The genuine leather upper delivers a polished, sophisticated look along with durable wear and a comfortable feel that only gets better over time.\nCUSHIONED COMFORT: Say goodbye to foot fatigue. Engineered with advanced truTECH Technology, these oxfords feature lightweight comfort that expertly absorbs shock and provides long-lasting, targeted cushioning right in the heel.\nCUSTOMIZABLE SUPPORT: We understand that everyone's feet are unique. These shoes come equipped with removable insoles, making them perfect for customizing your fit or easily accommodating your own orthotic inserts to adapt perfectly to your lifestyle and needs.\nDYNAMIC FLEXIBILITY: Designed for the modern, active professional. Optimized for active lifestyles, you'll experience superior movement and comfort with our shoes, meticulously designed to provide dynamic flexibility and supportive structure in every single step.\nTHE PERFECT FIT: Finding the right size has never been easier. Find the perfect fit for every foot with our comprehensive range of extended sizes and widths, ensuring comfort from medium to wide profiles.";
      
      await product.save();
      console.log('Successfully updated Leather Oxford Shoes!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateOxfords();
