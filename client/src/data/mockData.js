export const CUISINES = [
  {
    id: 'biryani',
    name: 'Biryani & Pulao',
    count: '24+ Options',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'north-indian',
    name: 'North Indian Curries',
    count: '32+ Options',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'south-indian',
    name: 'South Indian Tiffins',
    count: '19+ Options',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'kebabs',
    name: 'Tandoor Kebabs',
    count: '21+ Options',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'street-food',
    name: 'Chaat & Street Food',
    count: '15+ Options',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'sweets',
    name: 'Desi Sweets & Halwa',
    count: '12+ Options',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80'
  }
];

export const OUTLET_TYPES = [
  { id: 'all', label: 'All Spots' },
  { id: 'Hotels & Fine Dine', label: 'Hotels & Fine Dine' },
  { id: 'Street Stalls & Thelas', label: 'Street Stalls & Thelas' },
  { id: 'Fast Food & Addas', label: 'Fast Food & Addas' },
  { id: 'Udupi & Tiffin Centers', label: 'Udupi & Tiffin Centers' },
  { id: 'Highway Dhabas', label: 'Highway Dhabas' },
  { id: 'Mithai & Sweet Shops', label: 'Mithai & Sweet Shops' }
];

export const RESTAURANTS = [
  {
    id: 'grand-maratha-pavilion',
    name: 'The Grand Maratha Pavilion',
    rating: 4.8,
    reviewsCount: '3.2k+',
    cuisines: ['Awadhi', 'Mughlai', 'Dum Biryani'],
    time: '35 MINS',
    distance: '3.5 km away',
    costForTwo: '₹1,200 for two',
    veg: false,
    offer: 'ROYAL FEAST 20% OFF',
    fssai: 'Certified',
    certified: true,
    establishmentType: 'Hotels & Fine Dine',
    priceTier: 'Premium (₹800+)',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    address: 'Grand Maratha Hotel, Residency Road, Bengaluru'
  },
  {
    id: 'sri-krishna-udupi-bhavan',
    name: 'Sri Krishna Udupi Upahar Bhavan',
    rating: 4.6,
    reviewsCount: '1.8k+',
    cuisines: ['South Indian', 'Filter Coffee', 'Tiffin'],
    time: '18 MINS',
    distance: '1.2 km away',
    costForTwo: '₹250 for two',
    veg: true,
    offer: 'PURE VEG • FAST TIFFIN',
    fssai: 'Certified',
    certified: true,
    establishmentType: 'Udupi & Tiffin Centers',
    priceTier: 'Mid-Range (₹300-500)',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200&auto=format&fit=crop&q=80',
    address: '100ft Road, Indiranagar, Bengaluru'
  },
  {
    id: 'sharmaji-chaat-corner',
    name: 'Sharmaji Chaat & Golgappa Corner',
    rating: 4.7,
    reviewsCount: '4.1k+',
    cuisines: ['Street Food', 'Chaat', 'North Indian Snacks'],
    time: '22 MINS',
    distance: '2.1 km away',
    costForTwo: '₹150 for two',
    veg: true,
    offer: 'ICONIC STREET FOOD',
    fssai: 'Certified',
    certified: true,
    establishmentType: 'Street Stalls & Thelas',
    priceTier: 'Affordable (₹100-200)',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80',
    address: 'Commercial Street, Tasker Town, Bengaluru'
  },
  {
    id: 'kolkata-roll-adda',
    name: 'Kolkata Roll Adda & Fast Food',
    rating: 4.4,
    reviewsCount: '1.4k+',
    cuisines: ['Kathi Rolls', 'Indo-Chinese', 'Momos'],
    time: '25 MINS',
    distance: '2.8 km away',
    costForTwo: '₹300 for two',
    veg: false,
    offer: 'BUY 2 ROLLS GET 10% OFF',
    fssai: 'Certified',
    certified: true,
    establishmentType: 'Fast Food & Addas',
    priceTier: 'Affordable (₹100-200)',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200&auto=format&fit=crop&q=80',
    address: '80ft Road, Koramangala, Bengaluru'
  },
  {
    id: 'sheri-punjab-dhaba',
    name: 'Sher-e-Punjab Highway Dhaba',
    rating: 4.5,
    reviewsCount: '2.9k+',
    cuisines: ['Punjabi', 'Tandoor', 'North Indian'],
    time: '32 MINS',
    distance: '4.5 km away',
    costForTwo: '₹450 for two',
    veg: false,
    offer: 'PIND SPECIAL THALI',
    fssai: 'Certified',
    certified: true,
    establishmentType: 'Highway Dhabas',
    priceTier: 'Mid-Range (₹300-500)',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=1200&auto=format&fit=crop&q=80',
    address: 'Outer Ring Road, Marathahalli, Bengaluru'
  },
  {
    id: 'bawarchi-biryani-darbar',
    name: 'Bawarchi Biryani Darbar',
    rating: 4.7,
    reviewsCount: '5.2k+',
    cuisines: ['Hyderabadi', 'Biryani', 'Kebabs'],
    time: '28 MINS',
    distance: '2.9 km away',
    costForTwo: '₹550 for two',
    veg: false,
    offer: 'HYDERABADI DUM SPECIAL',
    fssai: 'Certified',
    certified: true,
    establishmentType: 'Hotels & Fine Dine',
    priceTier: 'Mid-Range (₹300-500)',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=80',
    address: 'Old Airport Road, Murugeshpalya, Bengaluru'
  },
  {
    id: 'gupta-brothers-sweets',
    name: 'Gupta Brothers Sweets & Farsan Mart',
    rating: 4.6,
    reviewsCount: '1.6k+',
    cuisines: ['Mithai', 'Bengali Sweets', 'Gujarati Farsan'],
    time: '22 MINS',
    distance: '1.8 km away',
    costForTwo: '₹200 for two',
    veg: true,
    offer: 'PURE DESI GHEE SWEETS',
    fssai: 'Certified',
    certified: true,
    establishmentType: 'Mithai & Sweet Shops',
    priceTier: 'Affordable (₹100-200)',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&auto=format&fit=crop&q=80',
    address: 'Jayanagar 4th Block, Bengaluru'
  },
  {
    id: 'dragon-wok-momo-cart',
    name: 'Dragon Wok & Momo Cart',
    rating: 4.3,
    reviewsCount: '890+',
    cuisines: ['Indo-Chinese', 'Street Fast Food'],
    time: '20 MINS',
    distance: '1.5 km away',
    costForTwo: '₹220 for two',
    veg: false,
    offer: 'DESI CHINESE SPECIAL',
    fssai: 'Certified',
    certified: true,
    establishmentType: 'Street Stalls & Thelas',
    priceTier: 'Affordable (₹100-200)',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=1200&auto=format&fit=crop&q=80',
    address: 'Church Street, MG Road, Bengaluru'
  }
];

export const DISHES = [
  {
    id: 'dish-1',
    restaurantId: 'grand-maratha-pavilion',
    name: 'Raan-e-Murgh Royal Roast',
    price: 520,
    rating: 4.9,
    category: 'Starters',
    tag: 'Bestseller',
    veg: false,
    spicy: true,
    description: 'Whole chicken leg slow-roasted in tandoor with saffron, royal Awadhi spices, and unrefined butter glaze.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dish-2',
    restaurantId: 'sri-krishna-udupi-bhavan',
    name: 'Ghee Podi Thatte Idli (2 Pcs)',
    price: 110,
    rating: 4.8,
    category: 'Combos',
    tag: 'Bestseller',
    veg: true,
    spicy: true,
    description: 'Soft steamed disc idlis smothered in pure A2 cow ghee and fiery gun-powder chutney spice mix.',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dish-3',
    restaurantId: 'sharmaji-chaat-corner',
    name: 'Sooji Pani Puri (8 Pcs with 5 Waters)',
    price: 70,
    rating: 4.9,
    category: 'Starters',
    tag: 'Bestseller',
    veg: true,
    spicy: true,
    description: 'Crispy semolina puris served with teekha pudina, sweet imli, hing, garlic, and jeera flavored waters.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dish-4',
    restaurantId: 'kolkata-roll-adda',
    name: 'Double Egg Double Chicken Kathi Roll',
    price: 160,
    rating: 4.7,
    category: 'Combos',
    tag: 'Bestseller',
    veg: false,
    spicy: true,
    description: 'Flaky paratha layered with twin fried eggs, filled with char-grilled chicken tikka, onions, and kasundi.',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dish-5',
    restaurantId: 'sheri-punjab-dhaba',
    name: 'Pind di Slow-Cooked Dal Makhani',
    price: 240,
    rating: 4.8,
    category: 'Main Course',
    tag: 'Bestseller',
    veg: true,
    spicy: false,
    description: 'Overnight slow-cooked black lentils over wood coals, finished with homemade white butter and fresh cream.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dish-6',
    restaurantId: 'bawarchi-biryani-darbar',
    name: 'Hyderabadi Mutton Dum Biryani',
    price: 390,
    rating: 4.9,
    category: 'Main Course',
    tag: 'Bestseller',
    veg: false,
    spicy: true,
    description: 'Authentic kacchi biryani layered with marinated tender goat meat, fried onions, mint, and pure ghee.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dish-7',
    restaurantId: 'gupta-brothers-sweets',
    name: 'Kaju Katli (250g Gift Box)',
    price: 280,
    rating: 4.8,
    category: 'Sweets',
    tag: 'Bestseller',
    veg: true,
    spicy: false,
    description: 'Diamond-shaped cashew fudge crafted from premium Goan cashews and pure sugar, decorated with silver leaf.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'dish-8',
    restaurantId: 'dragon-wok-momo-cart',
    name: 'Street Veg Hakka Noodles',
    price: 140,
    rating: 4.5,
    category: 'Main Course',
    tag: 'Bestseller',
    veg: true,
    spicy: true,
    description: 'High-flame wok tossed noodles with shredded cabbage, carrots, capsicum, soy sauce, and white pepper.',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80'
  }
];

export const SAVED_ADDRESSES = [];

export const INITIAL_CART = [];
