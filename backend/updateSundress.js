const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateSundress = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Casual Cotton Sundress' });
    
    if (product) {
      product.imageUrl = '/Casual Cotton Sundress/main.jpg';
      product.images = [
        '/Casual Cotton Sundress/dress.jpg.avif',
        '/Casual Cotton Sundress/OIP.jpg',
        '/Casual Cotton Sundress/Busydd-Summer-Dresses-Women-2025-Trendy-Solid-Color-Button-Cotton-Linen-Dress-Lapel-Sleeveless-Midi-Dresses-Women-Loose-Comfy-Casual-Sundresses-Women_db948e7d-12fe-4e80-8ec2-94b2c705e182.bfedeb81f2abd25585d68187571.avif',
        '/Casual Cotton Sundress/Sundresses-for-Women-Over-50-Ruffle-Tiered-Layered-Cotton-Linen-Sleeveless-Loose-Shirt-Dresses-Knee-Length-V-Neck-Vacation-Pleated-Dresses-Blue-M_4c8559f1-11a8-4727-a7d2-a5d127c0759f.172b5c164c5776e1233a730688e8960.avif'
      ];
      product.shortDescription = 'Experience ultimate comfort and style with our Casual Cotton Sundress. Perfect for warm summer days, beach outings, or relaxed weekend brunches.';
      product.description = "Step into summer with our beautifully crafted Casual Cotton Sundress. Made from 100% premium breathable cotton, this dress offers a lightweight feel that keeps you cool even on the hottest days. The elegant flowing design features a flattering fit for all body types, with adjustable straps and a subtly tiered skirt that adds a touch of bohemian charm. Whether you're dressing it up with wedges for an evening out or keeping it casual with sandals for a daytime stroll, this versatile piece is a must-have wardrobe staple. It includes hidden side pockets for practicality, and the fabric is pre-washed to ensure no shrinking. Machine washable and easy to maintain, it's designed to be your go-to outfit season after season.";
      
      await product.save();
      console.log('Successfully updated Casual Cotton Sundress!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct or run the full seed script.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateSundress();
