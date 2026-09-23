import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';
import MenuItem from './models/MenuItem.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crave_food_db';

const restaurantsData = [
  {
    name: 'The Grand Maratha Pavilion',
    slug: 'grand-maratha-pavilion',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    cuisines: ['Awadhi', 'Mughlai', 'Dum Biryani'],
    rating: 4.8,
    reviewsCount: 3200,
    deliveryTimeMin: 35,
    costForTwo: 1200,
    pureVeg: false,
    isAvailable: true,
    establishmentType: 'Hotels & Fine Dine',
    priceTier: 'Premium (₹800+)',
    distanceKm: 3.5,
    offerTag: 'ROYAL FEAST 20% OFF',
    isPromoted: true,
    address: 'Grand Maratha Hotel, Residency Road, Bengaluru',
    fssai: 'FSSAI License #11223004000891'
  },
  {
    name: 'Sri Krishna Udupi Upahar Bhavan',
    slug: 'sri-krishna-udupi-bhavan',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200&auto=format&fit=crop&q=80',
    cuisines: ['South Indian', 'Filter Coffee', 'Tiffin'],
    rating: 4.6,
    reviewsCount: 1850,
    deliveryTimeMin: 18,
    costForTwo: 250,
    pureVeg: true,
    isAvailable: true,
    establishmentType: 'Udupi & Tiffin Centers',
    priceTier: 'Mid-Range (₹300-500)',
    distanceKm: 1.2,
    offerTag: 'PURE VEG • FAST TIFFIN',
    isPromoted: false,
    address: '100ft Road, Indiranagar, Bengaluru',
    fssai: 'FSSAI License #11223004000772'
  },
  {
    name: 'Sharmaji Chaat & Golgappa Corner',
    slug: 'sharmaji-chaat-corner',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80',
    cuisines: ['Street Food', 'Chaat', 'North Indian Snacks'],
    rating: 4.7,
    reviewsCount: 4100,
    deliveryTimeMin: 22,
    costForTwo: 150,
    pureVeg: true,
    isAvailable: true,
    establishmentType: 'Street Stalls & Thelas',
    priceTier: 'Affordable (₹100-200)',
    distanceKm: 2.1,
    offerTag: 'ICONIC STREET FOOD',
    isPromoted: false,
    address: 'Commercial Street, Tasker Town, Bengaluru',
    fssai: 'FSSAI License #11223004000551'
  },
  {
    name: 'Kolkata Roll Adda & Fast Food',
    slug: 'kolkata-roll-adda',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&auto=format&fit=crop&q=80',
    cuisines: ['Kathi Rolls', 'Indo-Chinese', 'Momos'],
    rating: 4.4,
    reviewsCount: 1420,
    deliveryTimeMin: 25,
    costForTwo: 300,
    pureVeg: false,
    isAvailable: true,
    establishmentType: 'Fast Food & Addas',
    priceTier: 'Affordable (₹100-200)',
    distanceKm: 2.8,
    offerTag: 'BUY 2 ROLLS GET 10% OFF',
    isPromoted: false,
    address: '80ft Road, Koramangala, Bengaluru',
    fssai: 'FSSAI License #11223004000332'
  },
  {
    name: 'Sher-e-Punjab Highway Dhaba',
    slug: 'sheri-punjab-dhaba',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=1200&auto=format&fit=crop&q=80',
    cuisines: ['Punjabi', 'Tandoor', 'North Indian'],
    rating: 4.5,
    reviewsCount: 2900,
    deliveryTimeMin: 32,
    costForTwo: 450,
    pureVeg: false,
    isAvailable: true,
    establishmentType: 'Highway Dhabas',
    priceTier: 'Mid-Range (₹300-500)',
    distanceKm: 4.5,
    offerTag: 'PIND SPECIAL THALI',
    isPromoted: true,
    address: 'Outer Ring Road, Marathahalli, Bengaluru',
    fssai: 'FSSAI License #11223004000990'
  },
  {
    name: 'Bawarchi Biryani Darbar',
    slug: 'bawarchi-biryani-darbar',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
    cuisines: ['Hyderabadi', 'Biryani', 'Kebabs'],
    rating: 4.7,
    reviewsCount: 5200,
    deliveryTimeMin: 28,
    costForTwo: 550,
    pureVeg: false,
    isAvailable: true,
    establishmentType: 'Hotels & Fine Dine',
    priceTier: 'Mid-Range (₹300-500)',
    distanceKm: 2.9,
    offerTag: 'HYDERABADI DUM SPECIAL',
    isPromoted: true,
    address: 'Old Airport Road, Murugeshpalya, Bengaluru',
    fssai: 'FSSAI License #11223004000101'
  },
  {
    name: 'Gupta Brothers Sweets & Farsan Mart',
    slug: 'gupta-brothers-sweets',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&auto=format&fit=crop&q=80',
    cuisines: ['Mithai', 'Bengali Sweets', 'Gujarati Farsan'],
    rating: 4.6,
    reviewsCount: 1650,
    deliveryTimeMin: 22,
    costForTwo: 200,
    pureVeg: true,
    isAvailable: true,
    establishmentType: 'Mithai & Sweet Shops',
    priceTier: 'Affordable (₹100-200)',
    distanceKm: 1.8,
    offerTag: 'PURE DESI GHEE SWEETS',
    isPromoted: false,
    address: 'Jayanagar 4th Block, Bengaluru',
    fssai: 'FSSAI License #11223004000441'
  },
  {
    name: 'Dragon Wok & Momo Cart',
    slug: 'dragon-wok-momo-cart',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=1200&auto=format&fit=crop&q=80',
    cuisines: ['Indo-Chinese', 'Street Fast Food'],
    rating: 4.3,
    reviewsCount: 890,
    deliveryTimeMin: 20,
    costForTwo: 220,
    pureVeg: false,
    isAvailable: true,
    establishmentType: 'Street Stalls & Thelas',
    priceTier: 'Affordable (₹100-200)',
    distanceKm: 1.5,
    offerTag: 'DESI CHINESE SPECIAL',
    isPromoted: false,
    address: 'Church Street, MG Road, Bengaluru',
    fssai: 'FSSAI License #11223004000222'
  }
];

const menuItemsData = {
  'grand-maratha-pavilion': [
    {
      name: 'Raan-e-Murgh Royal Roast',
      category: 'Starters',
      price: 520,
      isVeg: false,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80',
      description: 'Whole chicken leg slow-roasted in tandoor with saffron, royal Awadhi spices, and unrefined butter glaze.'
    },
    {
      name: 'Galouti Kebab with Ulte Tawe ka Paratha',
      category: 'Starters',
      price: 460,
      isVeg: false,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
      description: 'Melt-in-mouth lamb kebabs infused with 160 secret herbs, served with delicate saffron inverted-griddle flatbread.'
    },
    {
      name: 'Shahi Royal Tukda',
      category: 'Sweets',
      price: 220,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80',
      description: 'Deep-fried bread soaked in saffron sugar syrup, topped with thick almond rabri and silver leaf.'
    },
    {
      name: 'Dum Gosht Biryani (Handi)',
      category: 'Main Course',
      price: 580,
      isVeg: false,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
      description: 'Aged basmati rice dum cooked with tender mutton chunks, mace, nutmeg, and rose water.'
    }
  ],
  'sri-krishna-udupi-bhavan': [
    {
      name: 'Ghee Podi Thatte Idli (2 Pcs)',
      category: 'Combos',
      price: 110,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&auto=format&fit=crop&q=80',
      description: 'Soft steamed disc idlis smothered in pure A2 cow ghee and fiery gun-powder chutney spice mix.'
    },
    {
      name: 'Mysore Masala Dosa',
      category: 'Main Course',
      price: 140,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&auto=format&fit=crop&q=80',
      description: 'Crispy golden crepe lined with garlic red chili paste and filled with spiced potato onion mash.'
    },
    {
      name: 'Medu Vada Sambar (2 Pcs)',
      category: 'Starters',
      price: 90,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&auto=format&fit=crop&q=80',
      description: 'Golden fried lentil donuts with crispy crust, served with drumstick sambar and fresh coconut chutney.'
    },
    {
      name: 'Degree Filter Coffee',
      category: 'Beverages',
      price: 45,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
      description: 'Authentic Chikmagalur chicory blend brewed in brass filter and frothed with thick hot milk.'
    },
    {
      name: 'Ghee Rava Kesari',
      category: 'Sweets',
      price: 80,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80',
      description: 'Semolina sweet pudding infused with saffron, cashew nuts, raisins, and aromatic cardamom.'
    }
  ],
  'sharmaji-chaat-corner': [
    {
      name: 'Sooji Pani Puri (8 Pcs with 5 Waters)',
      category: 'Starters',
      price: 70,
      isVeg: true,
      spiceLevel: 3,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
      description: 'Crispy semolina puris served with teekha pudina, sweet imli, hing, garlic, and jeera flavored waters.'
    },
    {
      name: 'Dahi Papdi Chaat',
      category: 'Starters',
      price: 90,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
      description: 'Flaky fried flour wafers topped with boiled potatoes, sweet yogurt, tamarind chutney, and sev.'
    },
    {
      name: 'Kurkure Aloo Tikki Plate',
      category: 'Starters',
      price: 85,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
      description: 'Golden shallow-fried potato patties crisp on the outside, served with chole curry and spiced curd.'
    },
    {
      name: 'Amritsari Matar Kulcha',
      category: 'Main Course',
      price: 110,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
      description: 'Soft tandoori leavened flatbread served with tangy dry spiced white pea gravy and pickled onions.'
    }
  ],
  'kolkata-roll-adda': [
    {
      name: 'Double Egg Double Chicken Kathi Roll',
      category: 'Combos',
      price: 160,
      isVeg: false,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&auto=format&fit=crop&q=80',
      description: 'Flaky paratha layered with twin fried eggs, filled with char-grilled chicken tikka, onions, and kasundi.'
    },
    {
      name: 'Paneer Malai Tikka Roll',
      category: 'Combos',
      price: 140,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&auto=format&fit=crop&q=80',
      description: 'Creamy marinated cottage cheese grilled over charcoal, wrapped in flaky laccha paratha.'
    },
    {
      name: 'Chili Chicken Dry (Desi Style)',
      category: 'Starters',
      price: 210,
      isVeg: false,
      spiceLevel: 3,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
      description: 'Crispy fried chicken tossed with capsicum, green chilies, soy sauce, and spring onions.'
    },
    {
      name: 'Schezwan Veg Fried Rice',
      category: 'Main Course',
      price: 170,
      isVeg: true,
      spiceLevel: 3,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
      description: 'Long grain basmati wok-tossed with crunch vegetables and spicy red Schezwan chili oil.'
    },
    {
      name: 'Steamed Darjeeling Chicken Momos (6 Pcs)',
      category: 'Starters',
      price: 130,
      isVeg: false,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
      description: 'Thin-skinned dumplings stuffed with juicy minced chicken, ginger, and herbs, served with fiery red dip.'
    }
  ],
  'sheri-punjab-dhaba': [
    {
      name: 'Pind di Slow-Cooked Dal Makhani',
      category: 'Main Course',
      price: 240,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&auto=format&fit=crop&q=80',
      description: 'Overnight slow-cooked black lentils over wood coals, finished with homemade white butter and fresh cream.'
    },
    {
      name: 'Tandoori Butter Naan Basket',
      category: 'Breads',
      price: 90,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
      description: 'Assorted hot tandoori breads including butter naan, garlic naan, and stuffed laccha paratha.'
    },
    {
      name: 'Highway Kadai Paneer',
      category: 'Main Course',
      price: 280,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80',
      description: 'Fresh paneer cubes cooked in iron wok with pounded coriander, red chilies, bell peppers, and tomato gravy.'
    },
    {
      name: 'Tandoori Murgh (Full Chicken)',
      category: 'Starters',
      price: 480,
      isVeg: false,
      spiceLevel: 3,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&auto=format&fit=crop&q=80',
      description: 'Whole chicken marinated in mustard oil, hung curd, and kashmiri chili, roasted crisp in charcoal clay oven.'
    },
    {
      name: 'Amritsari Thick Sweet Lassi',
      category: 'Beverages',
      price: 80,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80',
      description: 'Churned sweet creamy yogurt served in clay kulhad topped with a dollop of fresh malai.'
    }
  ],
  'bawarchi-biryani-darbar': [
    {
      name: 'Hyderabadi Mutton Dum Biryani',
      category: 'Main Course',
      price: 390,
      isVeg: false,
      spiceLevel: 3,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
      description: 'Authentic kacchi biryani layered with marinated tender goat meat, fried onions, mint, and pure ghee.'
    },
    {
      name: 'Crispy Chicken 65',
      category: 'Starters',
      price: 280,
      isVeg: false,
      spiceLevel: 3,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80',
      description: 'Deep-fried chicken morsels tempered with curry leaves, red chilies, mustard seeds, and spicy red sauce.'
    },
    {
      name: 'Hyderabadi Mirchi ka Salan',
      category: 'Main Course',
      price: 150,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&auto=format&fit=crop&q=80',
      description: 'Large green chilies simmered in a roasted peanut, sesame seed, coconut, and tamarind curry.'
    },
    {
      name: 'Royal Double ka Meetha',
      category: 'Sweets',
      price: 120,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80',
      description: 'Traditional Hyderabadi dessert made of fried bread soaked in cardamom condensed milk and dry fruits.'
    }
  ],
  'gupta-brothers-sweets': [
    {
      name: 'Kaju Katli (250g Gift Box)',
      category: 'Sweets',
      price: 280,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80',
      description: 'Diamond-shaped cashew fudge crafted from premium Goan cashews and pure sugar, decorated with silver leaf.'
    },
    {
      name: 'Hot Shahi Gulab Jamun (2 Pcs)',
      category: 'Sweets',
      price: 70,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80',
      description: 'Soft golden khoya dumplings fried in pure ghee and soaked in warm cardamom rose syrup.'
    },
    {
      name: 'Khamang Dhokla Plate (4 Pcs)',
      category: 'Starters',
      price: 60,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
      description: 'Spongy steamed gram flour cakes tempered with mustard seeds, curry leaves, and fresh coconut.'
    },
    {
      name: 'Kesar Rasmalai (2 Pcs)',
      category: 'Sweets',
      price: 110,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80',
      description: 'Flattened cottage cheese discs soaked in chilled saffron milk, garnished with pistachios and almonds.'
    },
    {
      name: 'Desi Ghee Jalebi with Rabdi',
      category: 'Sweets',
      price: 140,
      isVeg: true,
      spiceLevel: 1,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80',
      description: 'Crispy spiral jalebis fried fresh in ghee, served hot with a side of thick reduced saffron rabdi.'
    }
  ],
  'dragon-wok-momo-cart': [
    {
      name: 'Street Veg Hakka Noodles',
      category: 'Main Course',
      price: 140,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
      description: 'High-flame wok tossed noodles with shredded cabbage, carrots, capsicum, soy sauce, and white pepper.'
    },
    {
      name: 'Crispy Honey Chili Potato',
      category: 'Starters',
      price: 150,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: true,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
      description: 'Batter-fried crispy potato fingers coated in sweet chili garlic sauce, drizzled with honey and sesame seeds.'
    },
    {
      name: 'Chicken Manchow Soup with Fried Noodles',
      category: 'Starters',
      price: 120,
      isVeg: false,
      spiceLevel: 2,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
      description: 'Hot and spicy dark garlic soup with minced chicken, cilantro, and served with crunchy fried noodles.'
    },
    {
      name: 'Paneer Manchurian Gravy',
      category: 'Main Course',
      price: 180,
      isVeg: true,
      spiceLevel: 2,
      isBestseller: false,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
      description: 'Fried cottage cheese cubes simmered in garlic, ginger, coriander, and dark soy broth gravy.'
    }
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing database collections.');

    // Seed Demo User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const demoUser = new User({
      name: 'Priya Sharma',
      email: 'priya@crave.com',
      phone: '9876543210',
      password: hashedPassword,
      hasCompletedAddress: true,
      addresses: [
        {
          flat: 'Flat 402, Green Park Apartments',
          street: '12th Main, 100ft Road',
          area: 'Indiranagar',
          city: 'Bengaluru',
          pincode: '560038',
          landmark: 'Opposite BDA Complex',
          isDefault: true
        }
      ]
    });
    await demoUser.save();
    console.log('👤 Demo User seeded: priya@crave.com / password123');

    // Seed Restaurants & Menu Items
    for (const rData of restaurantsData) {
      const restaurant = new Restaurant(rData);
      await restaurant.save();

      const items = menuItemsData[rData.slug] || [];
      for (const itemData of items) {
        const menuItem = new MenuItem({
          ...itemData,
          restaurant: restaurant._id
        });
        await menuItem.save();
      }
      console.log(`🏪 Seeded outlet: ${restaurant.name} [${restaurant.establishmentType}] with ${items.length} dishes.`);
    }

    console.log('🎉 Database seeding completed successfully with 8 non-kitchen establishments!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
