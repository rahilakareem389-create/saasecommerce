const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateMulti = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    
    console.log('Connected to MongoDB');
    
    const boots = await Product.findOne({ title: 'Summer Ankle Boots' });
    if (boots) {
      boots.imageUrl = '/Summer Ankle Boots/main.jpg';
      boots.images = [
        '/Summer Ankle Boots/51AvJUkTbML._AC_SY575_.jpg',
        '/Summer Ankle Boots/51kd7fEoYYL._AC_SY575_.jpg',
        '/Summer Ankle Boots/61-Bs5SXs9L._AC_SY575_.jpg',
        '/Summer Ankle Boots/61CpeIR2PmL._AC_SY575_.jpg',
        '/Summer Ankle Boots/61iWQyuUf+L._AC_SY575_.jpg',
        '/Summer Ankle Boots/61Jc0sXojoL._AC_SY575_.jpg',
        '/Summer Ankle Boots/61NgogXsOoL._AC_SY575_.jpg',
        '/Summer Ankle Boots/61ZLFF+ofrL._AC_SY575_.jpg',
        '/Summer Ankle Boots/716LqUxcFEL._AC_SY575_.jpg'
      ];
      boots.shortDescription = "Design: 6-Inch Waterproof Ankle Deck Boot\nMaterial: Bioprene Rubber Foam (Bio-Based)\nLining: Moisture-Wicking XpressCool System\nOutsole: Non-Marking, Slip-Resistant Chevron";
      boots.description = "6\" ANKLE DECK BOOT: Built for and trusted by fishermen around the world, the XTRATUF Women's Ankle Deck Boot is a great option for anyone looking for reliable, non-slip, waterproof footwear for use on land or water.\nLIGHTWEIGHT, DURABLE & SLIP RESISTANT: This lightweight boot is constructed from Bioprene, an innovative bio-based rubber foam. It features a molded BioLite footbed for comfort, convenient front and rear pull-on tabs, and a non-marking, slip-resistant Chevron outsole for superior traction.\nMOISTURE-WICKING LINING: XpressCool is a proprietary moisture-wicking lining system specifically designed to keep your feet cool, dry, and comfortable in both cool and warm environments. It actively pulls moisture away from the skin and promotes airflow to regulate temperature effectively.\nFISHEWEAR EXCLUSIVE DESIGN: This unique version is designed in collaboration with FisheWear and features their vibrant Fishe Water print, adding a stylish touch to your outdoor gear.\nSIZING TIP: Do you wear a half size? In general, we recommend women who wear a 1/2 size to size up for the most comfortable fit.";
      
      await boots.save();
      console.log('Successfully updated Summer Ankle Boots!');
    }

    const shirt = await Product.findOne({ title: 'Basic V-Neck T-Shirt' });
    if (shirt) {
      shirt.imageUrl = '/Basic V-Neck T-Shirt/main.jpg';
      shirt.images = [
        '/Basic V-Neck T-Shirt/71+HDU0IToL._AC_SY550_.jpg',
        '/Basic V-Neck T-Shirt/71hIbTH464L._AC_SY550_.jpg',
        '/Basic V-Neck T-Shirt/71l-agMAM3L._AC_SY550_.jpg',
        '/Basic V-Neck T-Shirt/71vx7kmCeoL._AC_SY550_.jpg',
        '/Basic V-Neck T-Shirt/81bBQiKhCAL._AC_SY550_.jpg',
        '/Basic V-Neck T-Shirt/81kW0EJ2xEL._AC_SY550_.jpg',
        '/Basic V-Neck T-Shirt/81LT10H1+aL._AC_SY550_.jpg'
      ];
      shirt.shortDescription = "Material: 95% Polyester, 5% Spandex\nNeckline: Sweetheart V-Neck\nFit: Trendy Loose Fit with Drop Shoulder\nCare: Machine Wash Cold or Hand Wash";
      shirt.description = "PREMIUM MATERIAL: Crafted from a high-quality blend of 95% Polyester and 5% Spandex. This women's summer top is soft to the skin, breathable, lightweight, and exceptionally comfortable to wear, keeping you cool and charming all day long.\nSTYLISH FEATURES: Featuring a classic V-neck, short roll sleeves, and a trendy loose fit. This basic tee effortlessly complements any body type and is available in plain, striped, and floral prints. (Note: The drop shoulder design provides an oversized, relaxed feel).\nVERSATILE MATCHES: This fashion summer top effortlessly matches any trendy ensemble. Pair it perfectly with jeans, denim shorts, skirts, overalls, skinny pants, or leggings, along with sneakers or heels to complete a relaxed and stylish look.\nPERFECT FOR ANY OCCASION: Whether it's for daily casual wear, dating, clubbing, parties, street style, office work, vacation, or beach outings, this top is your go-to choice for Spring, Summer, and Fall.\nGARMENT CARE: For the best results, do not bleach. Machine wash cold (hand wash recommended), dry on low heat or hang dry, and iron on low to avoid any deformation.";
      
      await shirt.save();
      console.log('Successfully updated Basic V-Neck T-Shirt!');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateMulti();
