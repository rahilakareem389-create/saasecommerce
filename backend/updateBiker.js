const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateBiker = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Premium Leather Biker Jacket' });
    
    if (product) {
      product.imageUrl = '/Premium Leather Biker Jacket/main.jpg';
      product.images = [
        '/Premium Leather Biker Jacket/71jg08zmUjL._AC_SX569_.jpg',
        '/Premium Leather Biker Jacket/71Onkt+uFeL._AC_SX569_.jpg',
        '/Premium Leather Biker Jacket/71REthyHW9L._AC_SX569_.jpg',
        '/Premium Leather Biker Jacket/71Tzkg33ILL._AC_SX569_.jpg'
      ];
      product.shortDescription = "Fabric type: Leather\nCare instructions: Dry Clean Only\nOrigin: Imported";
      product.description = "Features || Milled cowhide leather with a thickness of 1.2-1.3mm, featuring asymmetrical front zipper closure, half belt, snap down shoulder straps, side lace detailing, and action back shoulder panel. ( Tall sizes available, check out LKM1711TALL )\nMultiple pockets and features || 2 outside pockets with zipper closure, chest angled pocket with zipper, small coin pocket with snap closure, dual inside left and right concealed carry pockets, inside media pocket with wire feed, patented interior \"Patch Access\" zipper openings, and genuine YKK zippers. Full sleeve zip-out removable thermal liner for\nDurable || Constructed from high-quality genuine leather. Our motorcycle jacket men is the perfect choice for bikers who want a durable and long-lasting biker jacket that can withstand the rigors of the road. Police Jacket comes in a wide range of size (X-Small to 5X-Large) and the regular fit is suitable for men of all sizes. This motorcycle jacket features premium milled cowhide leather with a side lace detailing for added style and comfort while riding.\nFashion All-Season || Featuring a zip-up collar, our men's leather jacket is easy to take on and off and is equipped with a removable liner that makes it suitable for all-seasons and all-weather conditions. Whether you're riding in the fall or the cool winter season, Brando jacket will keep you warm and dry. Our black leather jacket is the perfect choice for adult riders who want to elevate their look and can stand through the harsh weather elements.\nVersatile || If you're looking for a Negan jacket that will stand the test of time and stand out, then our real leather, thick and heavy jacket is an excellent choice especially motorcycle riders and riding club members. It's versatile and functional, leather riding jackets are essential staple to riding. As an investment, a real leather jacket is preferable over faux leather both for its durability and more comfortable fit. Our top-quality leather jacket can last a lifetime with care.";
      
      await product.save();
      console.log('Successfully updated Premium Leather Biker Jacket!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateBiker();
