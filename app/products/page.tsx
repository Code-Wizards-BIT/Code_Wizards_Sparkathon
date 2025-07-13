import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
              <p className="text-gray-600">Comprehensive product demand analytics and heatmaps</p>
            </div>
          </div>
        </div>
      </div>
      <ProductGrid />
    </div>
  )
}
