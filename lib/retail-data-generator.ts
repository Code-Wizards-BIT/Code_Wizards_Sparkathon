export interface RetailProduct {
  id: string
  name: string
  price: number
  category: string
  supplier: string
  perishable: boolean
  shelfLife?: number // days
}

export interface RetailSalesEvent {
  id: string
  productId: string
  quantity: number
  revenue: number
  location: { lat: number; lng: number }
  timestamp: Date
  hour: number
  month: number
  year: number
  storeId: string
  customerId: string
  category: string
}

// Comprehensive retail product catalog based on real retail data
export const RETAIL_PRODUCTS: RetailProduct[] = [
  // Beverages
  {
    id: "coca-cola-500ml",
    name: "Coca-Cola 500ml",
    price: 1.99,
    category: "Beverages",
    supplier: "Coca-Cola Co",
    perishable: false,
  },
  {
    id: "pepsi-500ml",
    name: "Pepsi 500ml",
    price: 1.89,
    category: "Beverages",
    supplier: "PepsiCo",
    perishable: false,
  },
  {
    id: "water-bottle-500ml",
    name: "Spring Water 500ml",
    price: 0.99,
    category: "Beverages",
    supplier: "AquaPure",
    perishable: false,
  },
  {
    id: "orange-juice-1l",
    name: "Fresh Orange Juice 1L",
    price: 3.49,
    category: "Beverages",
    supplier: "Tropicana",
    perishable: true,
    shelfLife: 7,
  },
  {
    id: "coffee-premium-250g",
    name: "Premium Coffee Beans 250g",
    price: 8.99,
    category: "Beverages",
    supplier: "Starbucks",
    perishable: false,
  },
  {
    id: "energy-drink-250ml",
    name: "Energy Drink 250ml",
    price: 2.49,
    category: "Beverages",
    supplier: "Red Bull",
    perishable: false,
  },

  // Fresh Produce
  {
    id: "bananas-1kg",
    name: "Fresh Bananas 1kg",
    price: 2.99,
    category: "Fresh Produce",
    supplier: "Fresh Farms",
    perishable: true,
    shelfLife: 5,
  },
  {
    id: "apples-red-1kg",
    name: "Red Apples 1kg",
    price: 3.99,
    category: "Fresh Produce",
    supplier: "Orchard Fresh",
    perishable: true,
    shelfLife: 14,
  },
  {
    id: "tomatoes-500g",
    name: "Fresh Tomatoes 500g",
    price: 2.49,
    category: "Fresh Produce",
    supplier: "Garden Fresh",
    perishable: true,
    shelfLife: 7,
  },
  {
    id: "lettuce-iceberg",
    name: "Iceberg Lettuce",
    price: 1.99,
    category: "Fresh Produce",
    supplier: "Green Valley",
    perishable: true,
    shelfLife: 10,
  },
  {
    id: "carrots-1kg",
    name: "Fresh Carrots 1kg",
    price: 1.79,
    category: "Fresh Produce",
    supplier: "Root Vegetables Co",
    perishable: true,
    shelfLife: 21,
  },
  {
    id: "potatoes-2kg",
    name: "Potatoes 2kg",
    price: 3.49,
    category: "Fresh Produce",
    supplier: "Farm Direct",
    perishable: true,
    shelfLife: 30,
  },

  // Dairy & Eggs
  {
    id: "milk-whole-1l",
    name: "Whole Milk 1L",
    price: 2.99,
    category: "Dairy & Eggs",
    supplier: "Dairy Fresh",
    perishable: true,
    shelfLife: 7,
  },
  {
    id: "eggs-dozen",
    name: "Free Range Eggs (12)",
    price: 4.49,
    category: "Dairy & Eggs",
    supplier: "Happy Hens",
    perishable: true,
    shelfLife: 21,
  },
  {
    id: "cheese-cheddar-200g",
    name: "Cheddar Cheese 200g",
    price: 5.99,
    category: "Dairy & Eggs",
    supplier: "Cheese Masters",
    perishable: true,
    shelfLife: 14,
  },
  {
    id: "yogurt-greek-500g",
    name: "Greek Yogurt 500g",
    price: 4.99,
    category: "Dairy & Eggs",
    supplier: "Mediterranean",
    perishable: true,
    shelfLife: 14,
  },
  {
    id: "butter-250g",
    name: "Salted Butter 250g",
    price: 3.99,
    category: "Dairy & Eggs",
    supplier: "Dairy Gold",
    perishable: true,
    shelfLife: 30,
  },

  // Meat & Seafood
  {
    id: "chicken-breast-1kg",
    name: "Chicken Breast 1kg",
    price: 12.99,
    category: "Meat & Seafood",
    supplier: "Premium Poultry",
    perishable: true,
    shelfLife: 3,
  },
  {
    id: "ground-beef-500g",
    name: "Ground Beef 500g",
    price: 8.99,
    category: "Meat & Seafood",
    supplier: "Quality Meats",
    perishable: true,
    shelfLife: 2,
  },
  {
    id: "salmon-fillet-400g",
    name: "Atlantic Salmon Fillet 400g",
    price: 15.99,
    category: "Meat & Seafood",
    supplier: "Ocean Fresh",
    perishable: true,
    shelfLife: 2,
  },
  {
    id: "pork-chops-600g",
    name: "Pork Chops 600g",
    price: 9.99,
    category: "Meat & Seafood",
    supplier: "Farm Fresh Pork",
    perishable: true,
    shelfLife: 3,
  },

  // Bakery
  {
    id: "bread-white-loaf",
    name: "White Bread Loaf",
    price: 2.49,
    category: "Bakery",
    supplier: "Daily Bread",
    perishable: true,
    shelfLife: 5,
  },
  {
    id: "croissants-6pack",
    name: "Butter Croissants (6)",
    price: 4.99,
    category: "Bakery",
    supplier: "French Bakery",
    perishable: true,
    shelfLife: 3,
  },
  {
    id: "muffins-blueberry-4pack",
    name: "Blueberry Muffins (4)",
    price: 5.99,
    category: "Bakery",
    supplier: "Sweet Treats",
    perishable: true,
    shelfLife: 4,
  },
  {
    id: "bagels-sesame-6pack",
    name: "Sesame Bagels (6)",
    price: 3.99,
    category: "Bakery",
    supplier: "Morning Fresh",
    perishable: true,
    shelfLife: 5,
  },

  // Frozen Foods
  {
    id: "ice-cream-vanilla-1l",
    name: "Vanilla Ice Cream 1L",
    price: 6.99,
    category: "Frozen Foods",
    supplier: "Creamy Delights",
    perishable: true,
    shelfLife: 90,
  },
  {
    id: "frozen-pizza-margherita",
    name: "Frozen Margherita Pizza",
    price: 7.99,
    category: "Frozen Foods",
    supplier: "Italian Kitchen",
    perishable: true,
    shelfLife: 180,
  },
  {
    id: "frozen-vegetables-1kg",
    name: "Mixed Frozen Vegetables 1kg",
    price: 4.49,
    category: "Frozen Foods",
    supplier: "Frozen Fresh",
    perishable: true,
    shelfLife: 365,
  },

  // Snacks & Confectionery
  {
    id: "potato-chips-150g",
    name: "Potato Chips 150g",
    price: 2.99,
    category: "Snacks & Confectionery",
    supplier: "Crispy Snacks",
    perishable: false,
  },
  {
    id: "chocolate-bar-100g",
    name: "Milk Chocolate Bar 100g",
    price: 2.49,
    category: "Snacks & Confectionery",
    supplier: "Sweet Chocolate",
    perishable: false,
  },
  {
    id: "nuts-mixed-200g",
    name: "Mixed Nuts 200g",
    price: 5.99,
    category: "Snacks & Confectionery",
    supplier: "Nutty Delights",
    perishable: false,
  },
  {
    id: "cookies-chocolate-chip",
    name: "Chocolate Chip Cookies",
    price: 3.99,
    category: "Snacks & Confectionery",
    supplier: "Cookie Co",
    perishable: false,
  },

  // Pantry Staples
  {
    id: "rice-jasmine-2kg",
    name: "Jasmine Rice 2kg",
    price: 5.99,
    category: "Pantry Staples",
    supplier: "Asian Grains",
    perishable: false,
  },
  {
    id: "pasta-spaghetti-500g",
    name: "Spaghetti Pasta 500g",
    price: 1.99,
    category: "Pantry Staples",
    supplier: "Italian Pasta Co",
    perishable: false,
  },
  {
    id: "olive-oil-500ml",
    name: "Extra Virgin Olive Oil 500ml",
    price: 8.99,
    category: "Pantry Staples",
    supplier: "Mediterranean Gold",
    perishable: false,
  },
  {
    id: "canned-tomatoes-400g",
    name: "Canned Diced Tomatoes 400g",
    price: 1.49,
    category: "Pantry Staples",
    supplier: "Garden Canned",
    perishable: false,
  },

  // Personal Care
  {
    id: "shampoo-400ml",
    name: "Daily Shampoo 400ml",
    price: 6.99,
    category: "Personal Care",
    supplier: "Hair Care Pro",
    perishable: false,
  },
  {
    id: "toothpaste-100ml",
    name: "Whitening Toothpaste 100ml",
    price: 3.99,
    category: "Personal Care",
    supplier: "Dental Fresh",
    perishable: false,
  },
  {
    id: "soap-bar-100g",
    name: "Moisturizing Soap Bar 100g",
    price: 2.49,
    category: "Personal Care",
    supplier: "Clean & Fresh",
    perishable: false,
  },

  // Household Items
  {
    id: "toilet-paper-12pack",
    name: "Toilet Paper 12-pack",
    price: 12.99,
    category: "Household Items",
    supplier: "Soft Touch",
    perishable: false,
  },
  {
    id: "dish-soap-500ml",
    name: "Dish Washing Liquid 500ml",
    price: 3.49,
    category: "Household Items",
    supplier: "Clean Kitchen",
    perishable: false,
  },
  {
    id: "laundry-detergent-1l",
    name: "Laundry Detergent 1L",
    price: 8.99,
    category: "Household Items",
    supplier: "Fresh Wash",
    perishable: false,
  },
]

// NYC area bounds for realistic locations
const NYC_BOUNDS = {
  minLat: 40.6892,
  maxLat: 40.7489,
  minLng: -74.0445,
  maxLng: -73.9597,
}

// Store locations across NYC
const STORE_LOCATIONS = [
  { id: "store-001", name: "Manhattan Central", lat: 40.7589, lng: -73.9851 },
  { id: "store-002", name: "Brooklyn Heights", lat: 40.6962, lng: -73.9936 },
  { id: "store-003", name: "Queens Plaza", lat: 40.7505, lng: -73.937 },
  { id: "store-004", name: "Bronx Hub", lat: 40.8176, lng: -73.9782 },
  { id: "store-005", name: "Staten Island Mall", lat: 40.5795, lng: -74.1502 },
]

// Generate random location within NYC bounds
function generateRandomLocation() {
  return {
    lat: NYC_BOUNDS.minLat + Math.random() * (NYC_BOUNDS.maxLat - NYC_BOUNDS.minLat),
    lng: NYC_BOUNDS.minLng + Math.random() * (NYC_BOUNDS.maxLng - NYC_BOUNDS.minLng),
  }
}

// Generate realistic sales patterns based on time and product type
function getHourlyMultiplier(hour: number, category: string): number {
  // Base patterns
  let multiplier = 1.0

  // General patterns
  if (hour >= 7 && hour <= 9)
    multiplier = 2.2 // Morning rush
  else if (hour >= 12 && hour <= 14)
    multiplier = 2.0 // Lunch rush
  else if (hour >= 17 && hour <= 19)
    multiplier = 1.8 // Evening rush
  else if (hour >= 10 && hour <= 11)
    multiplier = 1.4 // Late morning
  else if (hour >= 15 && hour <= 16)
    multiplier = 1.3 // Afternoon
  else if (hour >= 20 && hour <= 22)
    multiplier = 0.9 // Evening
  else if (hour >= 23 || hour <= 6) multiplier = 0.3 // Night/early morning

  // Category-specific adjustments
  switch (category) {
    case "Beverages":
      if (hour >= 6 && hour <= 10) multiplier *= 1.5 // Morning coffee/drinks
      if (hour >= 14 && hour <= 16) multiplier *= 1.3 // Afternoon drinks
      break
    case "Fresh Produce":
      if (hour >= 8 && hour <= 12) multiplier *= 1.4 // Morning shopping
      if (hour >= 17 && hour <= 19) multiplier *= 1.6 // Dinner prep
      break
    case "Bakery":
      if (hour >= 6 && hour <= 9) multiplier *= 2.0 // Fresh bread morning
      if (hour >= 16 && hour <= 18) multiplier *= 1.3 // Afternoon treats
      break
    case "Meat & Seafood":
      if (hour >= 16 && hour <= 19) multiplier *= 1.8 // Dinner preparation
      if (hour >= 10 && hour <= 12) multiplier *= 1.2 // Lunch prep
      break
    case "Dairy & Eggs":
      if (hour >= 7 && hour <= 9) multiplier *= 1.6 // Breakfast items
      if (hour >= 17 && hour <= 19) multiplier *= 1.4 // Dinner prep
      break
    case "Snacks & Confectionery":
      if (hour >= 14 && hour <= 16) multiplier *= 1.8 // Afternoon snacks
      if (hour >= 19 && hour <= 21) multiplier *= 1.5 // Evening treats
      break
    case "Frozen Foods":
      if (hour >= 17 && hour <= 20) multiplier *= 1.6 // Dinner planning
      break
  }

  return Math.max(0.1, multiplier)
}

// Generate seasonal multipliers
function getSeasonalMultiplier(month: number, category: string): number {
  let multiplier = 1.0

  switch (category) {
    case "Frozen Foods":
      if (month >= 5 && month <= 8) multiplier = 1.4 // Summer ice cream
      break
    case "Fresh Produce":
      if (month >= 3 && month <= 9) multiplier = 1.2 // Growing season
      break
    case "Beverages":
      if (month >= 5 && month <= 8) multiplier = 1.3 // Summer drinks
      break
    case "Personal Care":
      if (month === 11 || month === 0) multiplier = 1.2 // Holiday season
      break
  }

  return multiplier
}

export function generateRetailDataset(): RetailSalesEvent[] {
  const events: RetailSalesEvent[] = []
  const now = new Date()

  // Generate data for the last 365 days
  for (let day = 0; day < 365; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() - day)

    // Weekend multiplier
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const weekendMultiplier = isWeekend ? 1.3 : 1.0

    // Generate hourly data
    for (let hour = 0; hour < 24; hour++) {
      RETAIL_PRODUCTS.forEach((product) => {
        const hourMultiplier = getHourlyMultiplier(hour, product.category)
        const seasonalMultiplier = getSeasonalMultiplier(date.getMonth(), product.category)

        // Base probability of sale (adjusted by product popularity)
        let baseProbability = 0.1

        // Popular products have higher base probability
        if (["coca-cola-500ml", "milk-whole-1l", "bread-white-loaf", "bananas-1kg"].includes(product.id)) {
          baseProbability = 0.3
        } else if (product.category === "Fresh Produce" || product.category === "Dairy & Eggs") {
          baseProbability = 0.2
        }

        const finalProbability = baseProbability * hourMultiplier * seasonalMultiplier * weekendMultiplier

        // Generate multiple sales events based on probability
        const numEvents = Math.floor(Math.random() * 5 * finalProbability)

        for (let i = 0; i < numEvents; i++) {
          const quantity = Math.floor(Math.random() * 3) + 1
          const timestamp = new Date(date)
          timestamp.setHours(hour, Math.floor(Math.random() * 60))

          // Select random store
          const store = STORE_LOCATIONS[Math.floor(Math.random() * STORE_LOCATIONS.length)]

          // Generate location near store with some variance
          const location = {
            lat: store.lat + (Math.random() - 0.5) * 0.01,
            lng: store.lng + (Math.random() - 0.5) * 0.01,
          }

          events.push({
            id: `retail-${day}-${hour}-${product.id}-${i}`,
            productId: product.id,
            quantity,
            revenue: product.price * quantity,
            location,
            timestamp,
            hour,
            month: timestamp.getMonth(),
            year: timestamp.getFullYear(),
            storeId: store.id,
            customerId: `customer-${Math.random().toString(36).substr(2, 9)}`,
            category: product.category,
          })
        }
      })
    }
  }

  // Sort by timestamp
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}
