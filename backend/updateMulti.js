const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    // Update Windbreaker
    const windbreaker = await Product.findOne({ title: 'Lightweight Windbreaker' });
    if (windbreaker) {
      windbreaker.imageUrl = '/Lightweight Windbreaker/main.jpg';
      windbreaker.images = [
        '/Lightweight Windbreaker/61iH7Lx30DL._AC_SX466_.jpg',
        '/Lightweight Windbreaker/71pot3sxexL._AC_SX466_.jpg',
        '/Lightweight Windbreaker/71zz3vaDIeL._AC_SX466_.jpg',
        '/Lightweight Windbreaker/71zz82-NbJL._AC_SX466_.jpg'
      ];
      windbreaker.shortDescription = "Fabric type: 100% Nylon\nCare instructions: Hand Wash Only\nOrigin: Imported\nFur description: 33,000ft rain jacket for women is made of ripstop, high density polyester waterproof shell fabric";
      windbreaker.description = "Packability and Portability: 33,000ft packable rain jacket women is super lightweight, with packable carrying pouch, easy to keep in your handbag, travelling bag, suitcase or car. It's intelligently designed to allow minimal space occupation.Ultra-light weight only 250g.\nMultipurpose: 33,000ft womens hiking rain jacket Hide away hood suit for different occasions, you can customize your look and easily decide when you need or don't need a hood;Women's windbreaker jackets includes 2 outside zippered pockets, 2 inside roomy pocket, it is great for storing wallet, passport, money, keys, phone etc, providing great privacy and convenience for you.\nHumanized Design: 33,000ft Waterproof rain jacket for women is casual loose fashionable style makes you more free and comfortable; Adjustable drawcord hood to prevent yourself from being wet; Elastic cuffs prevent the rain drops to the cuffs; The hem contains elastic rope for warmth and keep you dry.\nAll-Weather Rain Jacket: 33,000ft Womens rain jackets waterproof with hood suitable for casual wear, outdoor sports, outdoor work, traveling, running,cycling, hiking, climbing, fishing, camping, hunting. Sun protection jacket women is a must-have item in your wardrobe all year round. You can wear a fashion jacket in spring, a sun protection jacket in summer, a raincoat jacket in rainy days, and a thick sweater under the winter to protect you from the wind chill.\nDue to the different colours displayed by different computers, the actual jacket colour may be slightly different from the picture. If you are wearing a thicker lining, we recommend that you purchase a jacket one size larger. Please allow 1-2 cm for manual measurement error.";
      await windbreaker.save();
      console.log('Successfully updated Lightweight Windbreaker!');
    }

    // Update Crossbody Bag
    const bag = await Product.findOne({ title: 'Leather Crossbody Bag' });
    if (bag) {
      bag.imageUrl = '/Leather Crossbody Bag/main.webp';
      bag.images = [
        '/Leather Crossbody Bag/71Ds+YxPBDL._AC_SX569_.jpg',
        '/Leather Crossbody Bag/71iRVYHaMGL._AC_UL480_FMwebp_QL65_.webp',
        '/Leather Crossbody Bag/71ivGRbezAL._AC_SX569_.jpg',
        '/Leather Crossbody Bag/71vvyVWlxcL._AC_UL480_FMwebp_QL65_.webp',
        '/Leather Crossbody Bag/81ojRbe2oZL._AC_UL480_FMwebp_QL65_.webp',
        '/Leather Crossbody Bag/81skFl1jUNL._AC_UL480_FMwebp_QL65_ (1).webp'
      ];
      bag.shortDescription = "Fabric type: Leather Refined Leather With A Shiny Finish Recycled Polyurethane\nCare instructions: Clean with a water-based leather cleaner and moisturizer. Use a protective spray to protect the leather surface.\nOrigin: Imported";
      bag.description = "STYLISH & SPACIOUS: The Sak Sequoia Hobo Bag is easy to carry and fits all of your everyday womens essentials. With the design of a hobo silhouette, this handbag is perfect for everyday wear.\nPERFECT FOR EVERYDAY TRAVEL: Features a main zipper closure, front zipper pocket, back slit pocket, and an interior with a back wall zipper pocket & 2 front wall multi-pockets\nPREMIUM ARTISANAL LEATHER: Bag exterior is leather sourced from a gold-rated certified tannery that complies with environmental sourcing processes & sustainable water usage. Bag interior is PETA-approved & Vegan Certified Repreve Lining.\nDIMENSIONS & CARE: Bag dimensions are 14\" L x 4\" W x 10.75\" H. Strap drop is 11\". To clean, use a water-based leather cleaner and moisturizer. Use a protective spray to protect the leather surface.\nTHE SAK: We've always been about more than bags, capturing our love of hand-crafted, textural designs. We are B Corp certified, given to companies that meet the highest standards in creating a positive social & environmental impact.";
      await bag.save();
      console.log('Successfully updated Leather Crossbody Bag!');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateProducts();
