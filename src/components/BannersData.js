// src/components/BannersData.js
const BANNERS_KEY = 'lyra_banners';
const BRANDS_KEY = 'lyra_brands';

// Default banners if none exist in localStorage
const DEFAULT_BANNERS = [
  {
    id: 'b1',
    title: 'Summer Collection',
    subtitle: 'Discover our new season styles',
    cta: 'Shop Now',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
    overlayColor: '#1e0a3c',
    displayMode: 'full',
    active: true
  },
  {
    id: 'b2',
    title: 'Luxury Redefined',
    subtitle: 'Premium fashion for your wardrobe',
    cta: 'Explore',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    from: 'from-indigo-900',
    to: 'to-purple-900',
    displayMode: 'split',
    active: true
  }
];

// Default brands if none exist in localStorage
const DEFAULT_BRANDS = [
  {
    id: 'br1',
    name: 'Nike',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    category: 'Footwear',
    bg: '#f5f5f5',
    active: true
  },
  {
    id: 'br2',
    name: 'Adidas',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
    category: 'Footwear',
    bg: '#f5f5f5',
    active: true
  }
];

// Initialize localStorage if empty
const initStorage = () => {
  if (!localStorage.getItem(BANNERS_KEY)) {
    localStorage.setItem(BANNERS_KEY, JSON.stringify(DEFAULT_BANNERS));
  }
  if (!localStorage.getItem(BRANDS_KEY)) {
    localStorage.setItem(BRANDS_KEY, JSON.stringify(DEFAULT_BRANDS));
  }
};

// Get all banners
export const getBanners = () => {
  initStorage();
  return JSON.parse(localStorage.getItem(BANNERS_KEY)) || [];
};

// Get all brands
export const getBrands = () => {
  initStorage();
  return JSON.parse(localStorage.getItem(BRANDS_KEY)) || [];
};

// Update banners
export const updateBanners = (newBanners) => {
  localStorage.setItem(BANNERS_KEY, JSON.stringify(newBanners));
  window.dispatchEvent(new Event('lyra_banners_updated'));
};

// Update brands
export const updateBrands = (newBrands) => {
  localStorage.setItem(BRANDS_KEY, JSON.stringify(newBrands));
  window.dispatchEvent(new Event('lyra_brands_updated'));
};