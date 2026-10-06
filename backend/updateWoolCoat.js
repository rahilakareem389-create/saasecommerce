const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateWoolCoat = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const product = await Product.findOne({ title: 'Winter Wool Coat' });
    
    if (product) {
      product.imageUrl = '/Winter Wool Coat/main.jpg';
      product.images = [
        '/Winter Wool Coat/51DcZOVWBSL._AC_SY550_.jpg',
        '/Winter Wool Coat/616WlxphOiL._AC_SY550_.jpg',
        '/Winter Wool Coat/61apfa9fQhL._AC_SY550_.jpg',
        '/Winter Wool Coat/61dgVOAVyCL._AC_SY550_.jpg',
        '/Winter Wool Coat/61DkeltlaPL._AC_SY741_.jpg',
        '/Winter Wool Coat/61FyRzhmWhL._AC_SY550_.jpg'
      ];
      product.shortDescription = "Fabric type: Fabric:Wool+Polyester,soft and warm\nCare instructions: Hand Wash Only\nOrigin: Imported";
      product.description = "- Front button closure\n- Slim fit,Simple solid wool coat,Show your beautiful body curve,Two hand pockets\n- Occasion:Mid-long wool overcoat,Perfect for your Daily wear,Work,Dating with friends and other casual occasions,All match,Great to wear with leggings, jeans,high heels, boots etc\n- Wash:Hand wash,Dry clean recommended\n- Notice:US SIZE,Imported\n\nStyle Details:\nColor: Wine\nStyle: Trench Coat\nSleeve Type: Long Sleeve\nCoat Silhouette Type: Trench Coat\nSeasons: Winter\nPattern: Solid\nFit Type: Fitted\nCollar Style: Round\nClimate Suitability: Cold Weather\nOccasion: casual, work";
      
      await product.save();
      console.log('Successfully updated Winter Wool Coat!');
    } else {
      console.log('Product not found in the database. Please make sure the name is correct.');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateWoolCoat();
