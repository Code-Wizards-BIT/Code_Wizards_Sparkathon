import { ProductHeatmap } from "@/components/product-heatmap"
import { ProductHeader } from "@/components/product-header"
import { DemandInsights } from "@/components/demand-insights"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProductHeader productId={id} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <ProductHeatmap productId={id} />
          </div>
          <div>
            <DemandInsights productId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}
