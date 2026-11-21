
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Heart,
  ShoppingBag,
  Search,
  ArrowUpDown,
  Scale
} from 'lucide-react'

import { useCart } from '../context/CartContext'
import { useCompare } from '../context/CompareContext'
import { supabase } from '../lib/supabase'

// ==========================================
// PRODUCT DATA
// ==========================================

export const products = [
  // SMARTPHONES
  {
    id: 1,
    name: 'iPhone 14 Pro',
    category: 'Smartphones',
    price: 54999,
    originalPrice: 79999,
    condition: 'Excellent',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23',
    category: 'Smartphones',
    price: 42999,
    originalPrice: 74999,
    condition: 'Excellent',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'
  },
  {
    id: 3,
    name: 'Google Pixel 7',
    category: 'Smartphones',
    price: 28999,
    originalPrice: 59999,
    condition: 'Very Good',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'
  },
  {
    id: 4,
    name: 'OnePlus 11',
    category: 'Smartphones',
    price: 31999,
    originalPrice: 61999,
    condition: 'Excellent',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800'
  },
  {
    id: 5,
    name: 'iPhone 13',
    category: 'Smartphones',
    price: 37999,
    originalPrice: 59900,
    condition: 'Very Good',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800'
  },
  {
    id: 6,
    name: 'Samsung Galaxy S22 Ultra',
    category: 'Smartphones',
    price: 39999,
    originalPrice: 89999,
    condition: 'Good',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=800'
  },
  {
    id: 7,
    name: 'Nothing Phone 2',
    category: 'Smartphones',
    price: 24999,
    originalPrice: 44999,
    condition: 'Excellent',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'
  },
  {
    id: 8,
    name: 'Redmi Note 12 Pro',
    category: 'Smartphones',
    price: 15999,
    originalPrice: 27999,
    condition: 'Very Good',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
  },
  {
    id: 9,
    name: 'iPhone 12',
    category: 'Smartphones',
    price: 26999,
    originalPrice: 49900,
    condition: 'Good',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?w=800'
  },
  {
    id: 10,
    name: 'Samsung Galaxy A54',
    category: 'Smartphones',
    price: 18999,
    originalPrice: 38999,
    condition: 'Excellent',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'
  },

  // LAPTOPS
  {
    id: 11,
    name: 'MacBook Air M2',
    category: 'Laptops',
    price: 74999,
    originalPrice: 114900,
    condition: 'Excellent',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
  },
  {
    id: 12,
    name: 'Dell XPS 13',
    category: 'Laptops',
    price: 64999,
    originalPrice: 109999,
    condition: 'Very Good',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
  },
  {
    id: 13,
    name: 'HP Pavilion 15',
    category: 'Laptops',
    price: 38999,
    originalPrice: 64999,
    condition: 'Excellent',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
  },
  {
    id: 14,
    name: 'Lenovo ThinkPad X1 Carbon',
    category: 'Laptops',
    price: 58999,
    originalPrice: 99999,
    condition: 'Very Good',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
  },
  {
    id: 15,
    name: 'ASUS ZenBook 14',
    category: 'Laptops',
    price: 47999,
    originalPrice: 79999,
    condition: 'Excellent',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
  },
  {
    id: 16,
    name: 'Acer Aspire 7',
    category: 'Laptops',
    price: 35999,
    originalPrice: 59999,
    condition: 'Good',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
  },
  {
    id: 17,
    name: 'MacBook Pro 14 M1',
    category: 'Laptops',
    price: 89999,
    originalPrice: 149900,
    condition: 'Very Good',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
  },
  {
    id: 18,
    name: 'Microsoft Surface Laptop 4',
    category: 'Laptops',
    price: 42999,
    originalPrice: 79999,
    condition: 'Excellent',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'
  },

  // AUDIO
  {
    id: 19,
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 19999,
    originalPrice: 29990,
    condition: 'Excellent',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'
  },
  {
    id: 20,
    name: 'Apple AirPods Pro 2',
    category: 'Audio',
    price: 14999,
    originalPrice: 24900,
    condition: 'Very Good',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800'
  },
  {
    id: 21,
    name: 'JBL Flip 6 Speaker',
    category: 'Audio',
    price: 6999,
    originalPrice: 11999,
    condition: 'Excellent',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'
  },
  {
    id: 22,
    name: 'Bose QuietComfort 45',
    category: 'Audio',
    price: 16999,
    originalPrice: 29900,
    condition: 'Very Good',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
  },
  {
    id: 23,
    name: 'Samsung Galaxy Buds2 Pro',
    category: 'Audio',
    price: 7999,
    originalPrice: 17999,
    condition: 'Excellent',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'
  },
  {
    id: 24,
    name: 'JBL Tune 760NC',
    category: 'Audio',
    price: 4999,
    originalPrice: 8999,
    condition: 'Good',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
  },
  {
    id: 25,
    name: 'Sony SRS-XB23 Speaker',
    category: 'Audio',
    price: 3999,
    originalPrice: 7999,
    condition: 'Very Good',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'
  },

  // WEARABLES
  {
    id: 26,
    name: 'Apple Watch Series 8',
    category: 'Wearables',
    price: 19999,
    originalPrice: 39900,
    condition: 'Excellent',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800'
  },
  {
    id: 27,
    name: 'Samsung Galaxy Watch 5',
    category: 'Wearables',
    price: 9999,
    originalPrice: 27999,
    condition: 'Very Good',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
  },
  {
    id: 28,
    name: 'Apple Watch SE',
    category: 'Wearables',
    price: 12999,
    originalPrice: 29900,
    condition: 'Excellent',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800'
  },
  {
    id: 29,
    name: 'Fitbit Versa 3',
    category: 'Wearables',
    price: 6999,
    originalPrice: 17999,
    condition: 'Good',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
  },
  {
    id: 30,
    name: 'Garmin Venu Sq',
    category: 'Wearables',
    price: 8999,
    originalPrice: 19999,
    condition: 'Very Good',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800'
  }
]

// ==========================================
// PRODUCT SPECIFICATIONS
// ==========================================

// RAM and storage configurations are shown as
// model options where the exact used-device variant
// has not yet been confirmed.

const specificationsByProduct = {
  // SMARTPHONES
  1: {
    Display: '6.1-inch Super Retina XDR OLED, ProMotion 120Hz',
    Processor: 'Apple A16 Bionic',
    RAM: '6GB',
    Storage: '128GB / 256GB / 512GB / 1TB',
    RearCamera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
    FrontCamera: '12MP TrueDepth',
    Battery: '3200mAh (approx.)',
    OperatingSystem: 'iOS',
    Connectivity: '5G, Wi-Fi 6, Bluetooth 5.3'
  },
  2: {
    Display: '6.1-inch Dynamic AMOLED 2X, 120Hz',
    Processor: 'Snapdragon 8 Gen 2',
    RAM: '8GB',
    Storage: '128GB / 256GB',
    RearCamera: '50MP Main + 12MP Ultra Wide + 10MP Telephoto',
    FrontCamera: '12MP',
    Battery: '3900mAh',
    OperatingSystem: 'Android',
    Connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3'
  },
  3: {
    Display: '6.3-inch OLED, 90Hz',
    Processor: 'Google Tensor G2',
    RAM: '8GB',
    Storage: '128GB / 256GB',
    RearCamera: '50MP Main + 12MP Ultra Wide',
    FrontCamera: '10.8MP',
    Battery: '4355mAh',
    OperatingSystem: 'Android',
    Connectivity: '5G, Wi-Fi 6E, Bluetooth 5.2'
  },
  4: {
    Display: '6.7-inch Fluid AMOLED, 120Hz',
    Processor: 'Snapdragon 8 Gen 2',
    RAM: '8GB / 16GB',
    Storage: '128GB / 256GB / 512GB',
    RearCamera: '50MP Main + 48MP Ultra Wide + 32MP Telephoto',
    FrontCamera: '16MP',
    Battery: '5000mAh',
    OperatingSystem: 'OxygenOS',
    Connectivity: '5G, Wi-Fi 7, Bluetooth 5.3'
  },
  5: {
    Display: '6.1-inch Super Retina XDR OLED',
    Processor: 'Apple A15 Bionic',
    RAM: '4GB',
    Storage: '128GB / 256GB / 512GB',
    RearCamera: '12MP Main + 12MP Ultra Wide',
    FrontCamera: '12MP',
    Battery: '3227mAh (approx.)',
    OperatingSystem: 'iOS',
    Connectivity: '5G, Wi-Fi 6, Bluetooth 5.0'
  },
  6: {
    Display: '6.8-inch Dynamic AMOLED 2X, 120Hz',
    Processor: 'Snapdragon 8 Gen 1',
    RAM: '8GB / 12GB',
    Storage: '128GB / 256GB / 512GB / 1TB',
    RearCamera: '108MP Main + 12MP Ultra Wide + 10MP Telephoto + 10MP Periscope Telephoto',
    FrontCamera: '40MP',
    Battery: '5000mAh',
    OperatingSystem: 'Android',
    Connectivity: '5G, Wi-Fi 6E, Bluetooth 5.2'
  },
  7: {
    Display: '6.7-inch LTPO OLED, 120Hz',
    Processor: 'Snapdragon 8+ Gen 1',
    RAM: '8GB / 12GB',
    Storage: '128GB / 256GB / 512GB',
    RearCamera: '50MP Main + 50MP Ultra Wide',
    FrontCamera: '32MP',
    Battery: '4700mAh',
    OperatingSystem: 'Nothing OS',
    Connectivity: '5G, Wi-Fi 6, Bluetooth 5.3'
  },
  8: {
    Display: '6.67-inch AMOLED, 120Hz',
    Processor: 'MediaTek Dimensity 1080',
    RAM: '6GB / 8GB / 12GB',
    Storage: '128GB / 256GB',
    RearCamera: '50MP Main + 8MP Ultra Wide + 2MP Macro',
    FrontCamera: '16MP',
    Battery: '5000mAh',
    OperatingSystem: 'Android',
    Connectivity: '5G, Wi-Fi, Bluetooth 5.2'
  },
  9: {
    Display: '6.1-inch Super Retina XDR OLED',
    Processor: 'Apple A14 Bionic',
    RAM: '4GB',
    Storage: '64GB / 128GB / 256GB',
    RearCamera: '12MP Main + 12MP Ultra Wide',
    FrontCamera: '12MP',
    Battery: '2815mAh (approx.)',
    OperatingSystem: 'iOS',
    Connectivity: '5G, Wi-Fi 6, Bluetooth 5.0'
  },
  10: {
    Display: '6.4-inch Super AMOLED, 120Hz',
    Processor: 'Exynos 1380',
    RAM: '6GB / 8GB',
    Storage: '128GB / 256GB',
    RearCamera: '50MP Main + 12MP Ultra Wide + 5MP Macro',
    FrontCamera: '32MP',
    Battery: '5000mAh',
    OperatingSystem: 'Android',
    Connectivity: '5G, Wi-Fi 6, Bluetooth 5.3'
  },

  // LAPTOPS
  11: {
    Display: '13.6-inch Liquid Retina, 2560 × 1664',
    Processor: 'Apple M2',
    RAM: '8GB / 16GB / 24GB Unified Memory',
    Storage: '256GB / 512GB / 1TB / 2TB SSD',
    Graphics: 'Integrated Apple GPU',
    OperatingSystem: 'macOS',
    Battery: 'Up to 18 hours (manufacturer claim)',
    Connectivity: 'Wi-Fi 6, Bluetooth 5.3',
    Ports: 'Thunderbolt / USB 4, MagSafe 3'
  },
  12: {
    Display: '13.4-inch Full HD+ or 4K (model dependent)',
    Processor: 'Intel Core i5 / i7 (generation dependent)',
    RAM: '8GB / 16GB / 32GB',
    Storage: '256GB / 512GB / 1TB SSD',
    Graphics: 'Integrated Intel Graphics',
    OperatingSystem: 'Windows',
    Battery: 'Depends on configuration and battery condition',
    Connectivity: 'Wi-Fi, Bluetooth',
    Ports: 'USB-C / Thunderbolt, model dependent'
  },
  13: {
    Display: '15.6-inch Full HD (variant dependent)',
    Processor: 'Intel Core or AMD Ryzen (model dependent)',
    RAM: '8GB / 16GB',
    Storage: '256GB / 512GB / 1TB SSD',
    Graphics: 'Integrated or dedicated graphics (variant dependent)',
    OperatingSystem: 'Windows',
    Battery: 'Depends on configuration and battery condition',
    Connectivity: 'Wi-Fi, Bluetooth',
    Ports: 'USB, HDMI, Audio Jack'
  },
  14: {
    Display: '14-inch Full HD / WQHD (generation dependent)',
    Processor: 'Intel Core i5 / i7 (generation dependent)',
    RAM: '8GB / 16GB / 32GB',
    Storage: '256GB / 512GB / 1TB SSD',
    Graphics: 'Integrated Intel Graphics',
    OperatingSystem: 'Windows',
    Battery: 'Depends on configuration and battery condition',
    Connectivity: 'Wi-Fi, Bluetooth',
    Ports: 'USB-C, USB-A, model dependent'
  },
  15: {
    Display: '14-inch OLED or LCD (variant dependent)',
    Processor: 'Intel Core or AMD Ryzen (variant dependent)',
    RAM: '8GB / 16GB',
    Storage: '256GB / 512GB / 1TB SSD',
    Graphics: 'Integrated Graphics',
    OperatingSystem: 'Windows',
    Battery: 'Depends on configuration and battery condition',
    Connectivity: 'Wi-Fi, Bluetooth',
    Ports: 'USB-C, USB-A, HDMI (model dependent)'
  },
  16: {
    Display: '15.6-inch Full HD (variant dependent)',
    Processor: 'Intel Core or AMD Ryzen (variant dependent)',
    RAM: '8GB / 16GB',
    Storage: '512GB / 1TB SSD (variant dependent)',
    Graphics: 'NVIDIA or integrated graphics (variant dependent)',
    OperatingSystem: 'Windows',
    Battery: 'Depends on configuration and battery condition',
    Connectivity: 'Wi-Fi, Bluetooth',
    Ports: 'USB, HDMI, Ethernet (model dependent)'
  },
  17: {
    Display: '14.2-inch Liquid Retina XDR',
    Processor: 'Apple M1 Pro / M1 Max',
    RAM: '16GB / 32GB / 64GB Unified Memory',
    Storage: '512GB / 1TB / 2TB / 4TB / 8TB SSD',
    Graphics: 'Integrated Apple GPU',
    OperatingSystem: 'macOS',
    Battery: 'Up to 17 hours (manufacturer claim)',
    Connectivity: 'Wi-Fi 6, Bluetooth 5.0',
    Ports: 'Thunderbolt, HDMI, SD Card, MagSafe'
  },
  18: {
    Display: '13.5-inch or 15-inch PixelSense',
    Processor: 'Intel Core or AMD Ryzen (variant dependent)',
    RAM: '8GB / 16GB / 32GB',
    Storage: '128GB / 256GB / 512GB / 1TB SSD',
    Graphics: 'Integrated Graphics',
    OperatingSystem: 'Windows',
    Battery: 'Depends on configuration and battery condition',
    Connectivity: 'Wi-Fi, Bluetooth',
    Ports: 'USB-C, USB-A, Surface Connect'
  },

  // AUDIO
  19: {
    Type: 'Over-ear Wireless Headphones',
    Connectivity: 'Bluetooth 5.2',
    NoiseCancellation: 'Active Noise Cancellation',
    Microphone: 'Built-in microphones',
    BatteryLife: 'Up to 30 hours (manufacturer claim)',
    Charging: 'USB-C',
    AudioFeatures: 'High-resolution audio support',
    Compatibility: 'Android, iOS, Windows'
  },
  20: {
    Type: 'True Wireless Earbuds',
    Connectivity: 'Bluetooth (generation depends on version)',
    NoiseCancellation: 'Active Noise Cancellation',
    Microphone: 'Built-in microphones',
    BatteryLife: 'Up to 6 hours per charge with ANC (manufacturer claim)',
    Charging: 'USB-C / Wireless Charging Case',
    AudioFeatures: 'Spatial Audio, Adaptive Audio features',
    Compatibility: 'Apple devices and Bluetooth devices'
  },
  21: {
    Type: 'Portable Bluetooth Speaker',
    Connectivity: 'Bluetooth 5.1',
    Output: '30W',
    BatteryLife: 'Up to 12 hours (manufacturer claim)',
    WaterResistance: 'IP67',
    Charging: 'USB-C',
    AudioFeatures: 'JBL Pro Sound',
    Compatibility: 'Bluetooth-enabled devices'
  },
  22: {
    Type: 'Over-ear Wireless Headphones',
    Connectivity: 'Bluetooth 5.1',
    NoiseCancellation: 'Active Noise Cancellation',
    Microphone: 'Built-in microphones',
    BatteryLife: 'Up to 24 hours (manufacturer claim)',
    Charging: 'USB-C',
    AudioFeatures: 'Aware Mode',
    Compatibility: 'Android, iOS, Windows'
  },
  23: {
    Type: 'True Wireless Earbuds',
    Connectivity: 'Bluetooth 5.3',
    NoiseCancellation: 'Active Noise Cancellation',
    Microphone: 'Built-in microphones',
    BatteryLife: 'Up to 5 hours with ANC (earbuds, manufacturer claim)',
    Charging: 'USB-C Wireless Charging Case',
    AudioFeatures: '360 Audio',
    Compatibility: 'Android and Bluetooth devices'
  },
  24: {
    Type: 'Wireless Over-ear Headphones',
    Connectivity: 'Bluetooth 5.0',
    NoiseCancellation: 'Active Noise Cancellation',
    Microphone: 'Built-in microphone',
    BatteryLife: 'Up to 50 hours (manufacturer claim)',
    Charging: 'USB-C',
    AudioFeatures: 'JBL Pure Bass Sound',
    Compatibility: 'Android, iOS, Windows'
  },
  25: {
    Type: 'Portable Bluetooth Speaker',
    Connectivity: 'Bluetooth',
    Output: '8W',
    BatteryLife: 'Up to 12 hours (manufacturer claim)',
    WaterResistance: 'IP67',
    Charging: 'USB-C',
    AudioFeatures: 'Extra Bass',
    Compatibility: 'Bluetooth-enabled devices'
  },

  // WEARABLES
  26: {
    Display: 'Always-On Retina LTPO OLED',
    Processor: 'Apple S8 SiP',
    Connectivity: 'GPS / Cellular (variant dependent)',
    Sensors: 'Heart Rate, Blood Oxygen, Temperature',
    HealthFeatures: 'ECG, Sleep Tracking, Activity Tracking',
    BatteryLife: 'Up to 18 hours (manufacturer claim)',
    WaterResistance: '50 metres water resistant',
    Compatibility: 'iPhone'
  },
  27: {
    Display: '1.2-inch or 1.4-inch Super AMOLED (model size dependent)',
    Processor: 'Exynos W920',
    Connectivity: 'Bluetooth, Wi-Fi, GPS',
    Sensors: 'Heart Rate, ECG, Bioelectrical Impedance',
    HealthFeatures: 'Sleep Tracking, Activity Tracking',
    BatteryLife: 'Up to 40 hours (manufacturer claim)',
    WaterResistance: '5ATM + IP68',
    Compatibility: 'Android'
  },
  28: {
    Display: 'Retina OLED',
    Processor: 'Apple S8 SiP (2nd generation SE)',
    Connectivity: 'GPS / Cellular (variant dependent)',
    Sensors: 'Heart Rate, Motion Sensors',
    HealthFeatures: 'Sleep Tracking, Activity Tracking',
    BatteryLife: 'Up to 18 hours (manufacturer claim)',
    WaterResistance: '50 metres water resistant',
    Compatibility: 'iPhone'
  },
  29: {
    Display: 'AMOLED Touchscreen',
    Processor: 'Not specified',
    Connectivity: 'Bluetooth, Wi-Fi, GPS',
    Sensors: 'Heart Rate, GPS, SpO2',
    HealthFeatures: 'Sleep Tracking, Activity Tracking',
    BatteryLife: 'Up to 6 days (manufacturer claim)',
    WaterResistance: 'Water resistant up to 50 metres',
    Compatibility: 'Android, iOS'
  },
  30: {
    Display: '1.3-inch LCD',
    Processor: 'Not specified',
    Connectivity: 'Bluetooth, GPS',
    Sensors: 'Heart Rate, Accelerometer, GPS',
    HealthFeatures: 'Fitness Tracking, Sleep Tracking',
    BatteryLife: 'Up to 6 days (manufacturer claim)',
    WaterResistance: '5 ATM',
    Compatibility: 'Android, iOS'
  }
}

// Attach specifications to products
products.forEach((product) => {
  product.specifications =
    specificationsByProduct[product.id] || {}
})

// ==========================================
// CATEGORIES
// ==========================================

const categories = [
  'All',
  'Smartphones',
  'Laptops',
  'Audio',
  'Wearables'
]

// ==========================================
// CURRENCY FORMATTER
// ==========================================

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)

// ==========================================
// PRODUCTS COMPONENT
// ==========================================

export default function Products() {
  const navigate = useNavigate()
  const { addToCart, cartCount } = useCart()

  const {
    addToCompare,
    removeFromCompare,
    isCompared,
    compareIds
  } = useCompare()

  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [wishlist, setWishlist] = useState([])
  const [inventory, setInventory] = useState({})
  const [inventoryLoading, setInventoryLoading] = useState(true)
  const [inventoryError, setInventoryError] = useState('')

  // Load stock quantities from Supabase.
  useEffect(() => {
    let isMounted = true

    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('product_id, stock_quantity, low_stock_threshold')

      if (!isMounted) return

      if (error) {
        console.error('Unable to load inventory:', error)
        setInventoryError('Stock information is temporarily unavailable.')
        setInventoryLoading(false)
        return
      }

      const stockByProduct = {}

      ;(data || []).forEach((item) => {
        stockByProduct[item.product_id] = {
          quantity: Number(item.stock_quantity) || 0,
          lowStockThreshold: Number(item.low_stock_threshold) || 0
        }
      })

      setInventory(stockByProduct)
      setInventoryError('')
      setInventoryLoading(false)
    }

    fetchInventory()

    // Keep shop stock in sync when the admin updates inventory.
    const channel = supabase
      .channel('shop-inventory-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        () => fetchInventory()
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  // Wishlist functionality
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        activeCategory === 'All' ||
        product.category === activeCategory

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price
      if (sort === 'high') return b.price - a.price
      if (sort === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <section
      id="shop"
      className="bg-[#F8F5FA] min-h-screen py-20 px-5 sm:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section heading */}
        <div className="mb-10">
          <p className="text-purple-600 font-bold text-xs tracking-wide uppercase mb-2">
            OUR COLLECTION
          </p>

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#211B2B] mb-3">
            Quality Tech. Better Prices.
          </h2>

          <p className="text-gray-500">
            Carefully inspected devices, ready for their next chapter.
          </p>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                    : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search and sorting */}
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Search */}
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 min-w-0 sm:w-56">
              <Search size={18} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search devices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none bg-transparent text-sm w-full min-w-0"
              />
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 sm:w-48">
              <ArrowUpDown size={16} className="text-gray-500" />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="outline-none bg-transparent text-sm w-full cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id)
            const isProductCompared = isCompared(product.id)
            const stock = inventory[product.id]?.quantity ?? 0
            const isOutOfStock = !inventoryLoading && stock <= 0
            const canAddToCart =
              !inventoryLoading && !inventoryError && stock > 0

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >

                {/* Product image */}
                <div
                  className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <span className="absolute top-4 left-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-2 rounded-full">
                    {product.condition}
                  </span>

                  {/* Wishlist icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(product.id)
                    }}
                    aria-label={
                      isWishlisted
                        ? 'Remove from wishlist'
                        : 'Add to wishlist'
                    }
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:text-purple-600 transition"
                  >
                    <Heart
                      size={18}
                      className={
                        isWishlisted
                          ? 'fill-purple-600 text-purple-600'
                          : 'text-gray-600'
                      }
                    />
                  </button>
                </div>

                {/* Product information */}
                <div className="p-5">

                  <p className="text-purple-600 text-xs font-bold mb-2">
                    {product.category}
                  </p>

                  <h3
                    className="text-lg font-bold text-[#211B2B] mb-2 cursor-pointer hover:text-purple-600"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                    <span className="text-yellow-500">★</span>
                    <span>{product.rating}</span>
                    <span>· Quality inspected</span>
                  </div>

                  {/* Stock availability */}
                  <div className="mb-4">
                    {inventoryLoading ? (
                      <span className="text-xs text-gray-400">
                        Checking availability...
                      </span>
                    ) : inventoryError ? (
                      <span className="text-xs text-red-600">
                        {inventoryError}
                      </span>
                    ) : stock <= 0 ? (
                      <span className="text-xs font-semibold text-red-600">
                        Out of stock
                      </span>
                    ) : stock <= (inventory[product.id]?.lowStockThreshold ?? 0) ? (
                      <span className="text-xs font-semibold text-orange-600">
                        Only {stock} left in stock
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-green-700">
                        {stock} available
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    <span className="text-lg font-extrabold text-[#211B2B]">
                      {formatPrice(product.price)}
                    </span>

                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>

                  {/* View Details */}
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 py-3 rounded-xl font-semibold mb-2 transition"
                  >
                    View Details
                  </button>

                  {/* Compare product */}
                  <button
                    onClick={() => {
                      if (isProductCompared) {
                        removeFromCompare(product.id)
                      } else {
                        addToCompare(product)
                      }
                    }}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold mb-2 border transition ${
                      isProductCompared
                        ? 'bg-purple-50 border-purple-600 text-purple-700'
                        : 'border-gray-200 text-gray-700 hover:border-purple-500 hover:text-purple-600'
                    }`}
                  >
                    <Scale size={17} />
                    {isProductCompared ? 'Added to Compare' : 'Compare'}
                  </button>

                  {/* Add to cart */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!canAddToCart}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 ${
                      canAddToCart
                        ? 'bg-[#211B2B] hover:bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={17} />
                    {inventoryLoading
                      ? 'Checking Stock...'
                      : inventoryError
                        ? 'Unavailable'
                        : isOutOfStock
                          ? 'Out of Stock'
                          : 'Add to Cart'}
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-purple-600 flex items-center justify-center gap-2"
                  >
                    <Heart
                      size={16}
                      className={
                        isWishlisted
                          ? 'fill-purple-600 text-purple-600'
                          : ''
                      }
                    />
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </button>

                </div>
              </div>
            )
          })}

        </div>

        {/* Empty search result */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Search
              size={40}
              className="mx-auto text-gray-300 mb-4"
            />

            <h3 className="text-xl font-bold text-gray-700">
              No products found
            </h3>

            <p className="text-gray-500 mt-2">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('All')
              }}
              className="mt-5 bg-purple-600 text-white px-6 py-3 rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Shopping statistics */}
        <div className="text-center mt-10 text-sm text-gray-500">
          {filteredProducts.length} products found
          {' · '}
          {wishlist.length} wishlisted
          {' · '}
          {cartCount} items in cart
          {' · '}
          {compareIds.length} selected to compare
        </div>

      </div>
    </section>
  )
}
