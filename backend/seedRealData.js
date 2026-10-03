const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  "Fashion", "Electronics", "Beauty & Personal Care", "Home & Living", 
  "Grocery", "Shoes", "Bags & Accessories", "Jewelry & Watches", 
  "Sports & Fitness", "Kids & Toys", "Books & Stationery", 
  "Health & Wellness", "Automotive", "Pet Supplies", "Mobile & Accessories"
];

const adjectives = ["Premium", "Classic", "Modern", "Luxury", "Pro", "Ultra", "Basic", "Advanced", "Smart", "Eco-friendly"];

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-store');
    console.log('Connected to DB');

    // Clear existing products and categories
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    for (let i = 0; i < categories.length; i++) {
      const catName = categories[i];
      const category = await Category.create({ 
        name: catName, 
        slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
      });

      console.log(`Created Category: ${catName}`);

      const productsToInsert = [];
      for (let j = 0; j < 10; j++) {
        const adjective = adjectives[j % adjectives.length];
        const title = `${adjective} ${catName} Item ${j + 1}`;
        const price = Math.floor(Math.random() * 200) + 10;
        
        // Ensure images are slightly different using Picsum with seeds
        const imageSeed = catName.replace(/ /g, '') + j;
        const imageUrl = `https://picsum.photos/seed/${imageSeed}/400/400`;

        productsToInsert.push({
          title,
          description: `This is a high-quality ${title} in the ${catName} category. It comes with premium features and excellent durability. Perfect for your daily needs.`,
          price,
          category: category._id,
          stock: Math.floor(Math.random() * 100) + 10,
          imageUrl,
          sku: `SKU-${catName.substring(0, 3).toUpperCase()}-${j+1000}`,
          variants: [
            { size: 'Default', color: 'Standard', stock: Math.floor(Math.random() * 100) + 10 }
          ]
        });
      }

      await Product.insertMany(productsToInsert);
      console.log(`Inserted 10 products for ${catName}`);
    }

    console.log('Seeding completely finished!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
