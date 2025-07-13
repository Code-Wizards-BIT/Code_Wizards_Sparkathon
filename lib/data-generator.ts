export interface Product {
  id: string
  name: string
  price: number
  category: string
}

export interface SalesEvent {
  id: string
  productId: string
  quantity: number
  revenue: number
  location: { lat: number; lng: number }
  timestamp: Date
  hour: number
  month: number
}

// NYC area bounds for realistic locations
const NYC_BOUNDS = {
  minLat: 40.6892,
  maxLat: 40.7489,
  minLng: -74.0445,
  maxLng: -73.9597,
}

const PRODUCTS = [
  { id: "coffee", name: "Premium Coffee", price: 4.99, category: "Beverages" },
  { id: "sandwich", name: "Artisan Sandwich", price: 8.99, category: "Food" },
  { id: "pastry", name: "Fresh Pastry", price: 3.49, category: "Bakery" },
  { id: "juice", name: "Fresh Juice", price: 5.99, category: "Beverages" },
  { id: "salad", name: "Garden Salad", price: 7.99, category: "Food" },
  { id: "muffin", name: "Blueberry Muffin", price: 2.99, category: "Bakery" },
  { id: "smoothie", name: "Protein Smoothie", price: 6.99, category: "Beverages" },
  { id: "wrap", name: "Chicken Wrap", price: 9.99, category: "Food" },
]

// Generate random location within NYC bounds
function generateRandomLocation() {
  return {
    lat: NYC_BOUNDS.minLat + Math.random() * (NYC_BOUNDS.maxLat - NYC_BOUNDS.minLat),
    lng: NYC_BOUNDS.minLng + Math.random() * (NYC_BOUNDS.maxLng - NYC_BOUNDS.minLng),
  }
}

// Generate realistic sales patterns based on time of day
function getHourlyMultiplier(hour: number): number {
  // Morning rush (7-9 AM)
  if (hour >= 7 && hour <= 9) return 2.5
  // Lunch rush (12-2 PM)
  if (hour >= 12 && hour <= 14) return 2.0
  // Evening rush (5-7 PM)
  if (hour >= 17 && hour <= 19) return 1.8
  // Late morning/early afternoon
  if (hour >= 10 && hour <= 11) return 1.3
  if (hour >= 15 && hour <= 16) return 1.2
  // Evening
  if (hour >= 20 && hour <= 22) return 0.8
  // Night/early morning
  if (hour >= 23 || hour <= 6) return 0.2
  // Default
  return 1.0
}

// Generate product preference by hour
function getProductPreferences(hour: number): Record<string, number> {
  const preferences: Record<string, number> = {}

  // Morning preferences
  if (hour >= 6 && hour <= 11) {
    preferences.coffee = 3.0
    preferences.pastry = 2.5
    preferences.muffin = 2.0
    preferences.juice = 1.5
  }
  // Lunch preferences
  else if (hour >= 11 && hour <= 15) {
    preferences.sandwich = 2.5
    preferences.salad = 2.0
    preferences.wrap = 2.2
    preferences.smoothie = 1.5
  }
  // Evening preferences
  else if (hour >= 17 && hour <= 21) {
    preferences.wrap = 1.8
    preferences.sandwich = 1.5
    preferences.salad = 1.3
  }

  return preferences
}

export function generateInitialDataset(): SalesEvent[] {
  const events: SalesEvent[] = []
  const now = new Date()

  // Generate data for the last 30 days
  for (let day = 0; day < 30; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() - day)

    // Generate hourly data
    for (let hour = 0; hour < 24; hour++) {
      const hourMultiplier = getHourlyMultiplier(hour)
      const productPrefs = getProductPreferences(hour)

      // Base number of events per hour (scaled by multiplier)
      const baseEvents = Math.floor(Math.random() * 10 + 5) * hourMultiplier

      for (let i = 0; i < baseEvents; i++) {
        // Select product based on preferences
        let selectedProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]

        // Apply hour-based preferences
        if (Object.keys(productPrefs).length > 0) {
          const prefProducts = PRODUCTS.filter((p) => productPrefs[p.id])
          if (prefProducts.length > 0 && Math.random() < 0.7) {
            const weights = prefProducts.map((p) => productPrefs[p.id] || 1)
            const totalWeight = weights.reduce((sum, w) => sum + w, 0)
            let random = Math.random() * totalWeight

            for (let j = 0; j < prefProducts.length; j++) {
              random -= weights[j]
              if (random <= 0) {
                selectedProduct = prefProducts[j]
                break
              }
            }
          }
        }

        const quantity = Math.floor(Math.random() * 3) + 1
        const timestamp = new Date(date)
        timestamp.setHours(hour, Math.floor(Math.random() * 60))

        events.push({
          id: `event-${day}-${hour}-${i}`,
          productId: selectedProduct.id,
          quantity,
          revenue: selectedProduct.price * quantity,
          location: generateRandomLocation(),
          timestamp,
          hour,
          month: timestamp.getMonth(),
        })
      }
    }
  }

  return events
}
