const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateShoes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Comfortable Running Shoes' });
    
    if (product) {
      product.imageUrl = '/Comfortable Running Shoes/main.jpg';
      product.images = [
        '/Comfortable Running Shoes/71mkJtAsr6L._AC_SY575_.jpg',
        '/Comfortable Running Shoes/813Pgd9e+tL._AC_SY575_.jpg',
        '/Comfortable Running Shoes/81BGGZFh2ZL._AC_SY575_.jpg',
        '/Comfortable Running Shoes/81C+t8tMn7L._AC_SY575_.jpg',
        '/Comfortable Running Shoes/81efl2dk1GL._AC_SY575_.jpg',
        '/Comfortable Running Shoes/81GCzekwr+L._AC_SY575_.jpg',
        '/Comfortable Running Shoes/81jwuz4tOdL._AC_SY575_.jpg',
        '/Comfortable Running Shoes/81ZBR3X4fUL._AC_SY575_.jpg'
      ];
      product.shortDescription = "Style: Max Cushioning Endeavour Canova (White/Black)\nMaterial: Breathable Mesh Outer, Fabric Inner, Polyurethane Sole\nSpecial Features: Maximum Cushioning, Lightweight, Machine Washable\nSport Type: Running, Walking";
      product.description = "MAXIMUM CUSHIONING TECHNOLOGY: Experience superior comfort with our max cushioning design featuring an Air-Cooled Goga Mat insole and Ultra Light midsole cushioning. Perfect for indoor walking, running, and all-day comfort.\nENGINEERED FOR PERFORMANCE: These athletic shoes provide exceptional support with Natural Rocker Technology for smooth, neutral heel-to-toe transitions.\nBREATHABLE COMFORT: The engineered mesh upper with synthetic overlays ensures excellent ventilation while providing structured support. \nEASY CARE & VEGAN FRIENDLY: Crafted with 100% vegan materials and featuring a flexible traction outsole. The machine-washable construction keeps your shoes looking fresh with minimal effort.\n\nFEATURES & SPECS:\n- Closure: Lace-Up (Eyelets with Aglets)\n- Cushioning Level: Maximum (Goga Mat Insole)\n- Water Resistance: Not Water Resistant\n- Heel/Toe Style: No Heel, Plain Toe\n- Occasion & Season: Casual Comfort, Spring/Summer\n- Perfect Gift: Ideal for Birthdays, Christmas, Mother's Day, or Valentine's Day.";
      
      await product.save();
      console.log('Successfully updated Comfortable Running Shoes!');
    } else {
      console.log('Product not found in the database.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateShoes();
