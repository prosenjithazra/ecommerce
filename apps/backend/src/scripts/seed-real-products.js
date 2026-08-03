const mongoose = require('mongoose');

const uri = 'mongodb+srv://adminkliamo:icBdyCz81CWrLMX6@kliamocluster.lnwdlde.mongodb.net/kliamo';

const products = [
  {
    id: 'qik-tee-white',
    name: "Premium Cotton Tee - White",
    price: 59900, // stored in cents/paise
    originalPrice: 79900,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80'],
    category: 'T-Shirts',
    tag: 'Best Seller',
    description: '100% bio-washed combed cotton premium blank tee. Optimized for Direct-to-Garment (DTG) printing.',
    colors: [{ name: 'White', hex: '#ffffff' }],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    sku: 'MVnHs-Wh-S',
    slug: 'premium-cotton-tee-white',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'qik-tee-black',
    name: "Premium Cotton Tee - Black",
    price: 59900,
    originalPrice: 79900,
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80'],
    category: 'T-Shirts',
    tag: 'Popular',
    description: '100% bio-washed combed cotton black blank tee. Optimized for Direct-to-Garment (DTG) printing.',
    colors: [{ name: 'Black', hex: '#0f172a' }],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    sku: 'MVnHs-Bl-S',
    slug: 'premium-cotton-tee-black',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'qik-hoodie-black',
    name: "Heavyweight Fleece Hoodie - Black",
    price: 129900,
    originalPrice: 159900,
    rating: 5.0,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&auto=format&fit=crop&q=80'],
    category: 'Hoodies',
    tag: 'New',
    description: 'Premium heavy fleece with double-lined hood. Ideal for all-over sublimation or DTG printing.',
    colors: [{ name: 'Black', hex: '#0f172a' }],
    sizes: ['M', 'L', 'XL', 'XXL'],
    inStock: true,
    sku: 'PHH-002',
    slug: 'heavyweight-fleece-hoodie-black',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'qik-cap-navy',
    name: "Embroidery Custom Canvas Cap - Navy",
    price: 89900,
    originalPrice: 119900,
    rating: 4.7,
    reviewsCount: 15,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&auto=format&fit=crop&q=80'],
    category: 'Accessories',
    tag: 'Embroidery',
    description: 'Structured 6-panel canvas cap template. Best suited for high-density custom embroidery.',
    colors: [{ name: 'Navy Blue', hex: '#1e3a8a' }],
    sizes: ['M', 'L'],
    inStock: true,
    sku: 'PHA-003',
    slug: 'embroidery-custom-canvas-cap-navy',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function main() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB database using Mongoose');
    
    const ProductSchema = new mongoose.Schema({
      id: { type: String, required: true },
      name: String,
      price: Number,
      originalPrice: Number,
      rating: Number,
      reviewsCount: Number,
      image: String,
      images: [String],
      category: String,
      tag: String,
      description: String,
      colors: Array,
      sizes: [String],
      inStock: Boolean,
      sku: String,
      slug: String
    }, { collection: 'products' });

    // Force delete existing model to prevent cached schema issues
    delete mongoose.models.Product;
    const ProductModel = mongoose.model('Product', ProductSchema);

    // Clear old products to avoid duplicate key errors on id constraints
    console.log('Clearing old products from database products collection...');
    await ProductModel.deleteMany({});
    console.log('Cleared successfully.');

    for (const p of products) {
      console.log(`Inserting product: ${p.name} (${p.id})`);
      await ProductModel.create(p);
    }
    console.log('Seeding successfully completed!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
