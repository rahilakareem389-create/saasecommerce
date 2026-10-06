const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateNecklace = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Minimalist Gold Necklace' });
    
    if (product) {
      product.imageUrl = '/Minimalist Gold Necklace/main.webp';
      product.images = [
        '/Minimalist Gold Necklace/51cKuu1DyFL._AC_UL480_FMwebp_QL65_.webp',
        '/Minimalist Gold Necklace/51IlTYv1B9L._AC_UL480_FMwebp_QL65_.webp',
        '/Minimalist Gold Necklace/51JaNKiZrsL._AC_UL480_FMwebp_QL65_.webp',
        '/Minimalist Gold Necklace/61ecXhQfFOL._AC_UL480_FMwebp_QL65_.webp',
        '/Minimalist Gold Necklace/71cCBi5Wx2L._AC_SY535_.jpg',
        '/Minimalist Gold Necklace/71Hnw4+oQUL._AC_SY675_.jpg',
        '/Minimalist Gold Necklace/71jLeKqBR9L._AC_UL480_FMwebp_QL65_.webp'
      ];
      product.shortDescription = "Material: Brass\nMetal type: Brass\nClasp type: Lobster\nChain type: Cable\nGem type: No Gemstone\nItem type name: Choker Necklaces";
      product.description = "Adjustable size: Layered dot gold necklace length 15 inches,CZ neckalce is 17 inches extended with 2 inches. Lobster buckle design, you can easily adjust the exquisite necklace length by yourself\nComfortable Material: Our necklace for women is made of high quality brass and 14k gold plated.Nickle free,lead free and hypoallergenic,tarnishing resistant,can be stored and worn for a long time\nPerfect holiday gift: This lady gold necklace is an exquisite gold jewelry gift, which is very suitable for valuable recipients such as wife, mother, daughter, sisters, teacher or best friend. Very suitable for commemorating special occasions, including birthdays, anniversaries, Valentine's Day, Christmas, Mother's Day, and Thanksgiving celebrations.\nCoshilta jewelry: We are a brand specializing in original jewelry, we focus on providing buyers with quality products and services, if you have any questions about gold necklace, please feel free to contact us";
      
      await product.save();
      console.log('Successfully updated Minimalist Gold Necklace!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateNecklace();
