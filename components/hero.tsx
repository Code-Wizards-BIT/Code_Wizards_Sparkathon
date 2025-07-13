import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, Play } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 border border-white rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 border border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            AI-Powered
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">
              Demand Forecasting
            </span>
          </h1>

          <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Revolutionary hyper-local demand intelligence that eliminates stockouts, reduces waste by 85%, and optimizes
            inventory with 94% accuracy using AI, weather data, and social sentiment analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Products
              </Button>
            </Link>
            <Link href="/analytics-v2">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </Link>
            <Link href="https://youtu.be/8OkpRK2_gVs?si=LBiUUr44Cy9W3_EL" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">85%</div>
              <div className="text-blue-100">Waste Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">94%</div>
              <div className="text-blue-100">Forecast Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300 mb-2">$847M</div>
              <div className="text-blue-100">Annual Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300 mb-2">{"<50ms"}</div>
              <div className="text-blue-100">Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
