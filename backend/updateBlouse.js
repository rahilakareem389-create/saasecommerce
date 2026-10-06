const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateBlouse = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Silk Button-Up Blouse' });
    
    if (product) {
      product.imageUrl = '/Silk Button-Up Blouse/main.jpg';
      product.images = [
        '/Silk Button-Up Blouse/51DgdEL4c2L._AC_SX425_.jpg',
        '/Silk Button-Up Blouse/51dOHezFKmL._AC_SX425_.jpg',
        '/Silk Button-Up Blouse/51EP+ZEhvIL._AC_SX425_.jpg',
        '/Silk Button-Up Blouse/51F2CUFPGTL._AC_SX425_.jpg',
        '/Silk Button-Up Blouse/51FBbn+LosL._AC_SX425_.jpg',
        '/Silk Button-Up Blouse/51igiOX+kbL._AC_SX425_.jpg',
        '/Silk Button-Up Blouse/51mbL53NL4L._AC_SX425_.jpg',
        '/Silk Button-Up Blouse/51o-NOGQMZL._AC_SX425_.jpg',
        '/Silk Button-Up Blouse/51SBAWDEO4L._AC_SX425_.jpg'
      ];
      product.shortDescription = "Fabric: 97% Polyester, 3% Spandex (Silky Satin)\nFit: Tailored Regular Fit with Flattering 3/4 Sleeves\nClosure: Classic Button-Down Front\nCare: Machine Wash (Laundry bag recommended)";
      product.description = "LUXURIOUS SILKY SATIN FABRIC: Made from a premium blend of 97% polyester and 3% spandex, this women's satin blouse offers a smooth, lightweight feel with a gorgeous subtle sheen. Highly breathable and incredibly soft, the silky fabric drapes elegantly for all-day comfort in both casual and formal settings.\nFLATTERING 3/4 SLEEVE & TAILORED FIT: Designed with a regular fit and 3/4 sleeves that flatter the arm line while perfectly balancing polish and breathability. This button-down shirt's tailored cut creates a refined silhouette, making it a perfect office top for layering or wearing solo year-round.\nTIMELESS BUTTON-DOWN STYLING: A classic turn-down collar and full button-front closure deliver incredibly flexible styling. Wear it fully buttoned up for a sharp business casual look, or leave it partially open for a relaxed, dressy vibe. It looks amazing whether tucked or untucked.\nVERSATILE WARDROBE STAPLE: This dressy satin blouse pairs effortlessly with your favorite trousers, pencil skirts, jeans, or shorts. It is absolutely ideal as a professional work blouse, a chic vacation top, a romantic date night shirt, or a standout party piece that transitions seamlessly from day to night.\nCARE & WRINKLE NOTE: Slight wrinkles from shipping are completely normal—simply steam or iron on low heat for a flawless look. When machine washing this silky blouse, always use a laundry bag and avoid washing with sharp-edged items to prevent snags and keep it looking pristine and polished.";
      
      await product.save();
      console.log('Successfully updated Silk Button-Up Blouse!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateBlouse();
