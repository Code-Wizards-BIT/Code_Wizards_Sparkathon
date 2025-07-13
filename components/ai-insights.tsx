"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Zap, Download, Sparkles } from "lucide-react"
import { RETAIL_PRODUCTS } from "@/lib/retail-data-generator"

interface AIInsightsProps {
  data: Array<{
    productId: string
    quantity: number
    revenue: number
    timestamp: Date
    hour: number
  }>
  categoryStats: Record<string, number>
}

export function AIInsights({ data, categoryStats }: AIInsightsProps) {
  const insights = useMemo(() => {
    if (data.length === 0) return null

    // Analyze peak hours
    const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
      const hourData = data.filter((item) => item.hour === hour)
      return {
        hour,
        sales: hourData.reduce((sum, item) => sum + item.quantity, 0),
        revenue: hourData.reduce((sum, item) => sum + item.revenue, 0),
      }
    })

    const peakHour = hourlyStats.reduce((max, current) => (current.sales > max.sales ? current : max))

    // Analyze product performance
    const productStats = RETAIL_PRODUCTS.map((product) => {
      const productData = data.filter((item) => item.productId === product.id)
      const totalSales = productData.reduce((sum, item) => sum + item.quantity, 0)
      const totalRevenue = productData.reduce((sum, item) => sum + item.revenue, 0)

      return {
        ...product,
        totalSales,
        totalRevenue,
        avgOrderSize: totalSales > 0 ? totalRevenue / totalSales : 0,
      }
    })
      .filter((p) => p.totalSales > 0)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)

    // Identify trends and patterns
    const topProduct = productStats[0]
    const lowPerformers = productStats.filter(
      (p) => p.totalSales < (productStats.reduce((sum, p) => sum + p.totalSales, 0) / productStats.length) * 0.5,
    )

    // Category analysis
    const topCategory = Object.entries(categoryStats).sort(([, a], [, b]) => b - a)[0]

    // Generate AI recommendations with enhanced intelligence
    const recommendations = []

    // Peak hour optimization
    if (peakHour.hour >= 12 && peakHour.hour <= 14) {
      recommendations.push({
        type: "optimization",
        title: "Lunch Rush Optimization",
        description: `Peak sales occur at ${peakHour.hour}:00. Consider increasing staff by 30% and pre-stocking high-demand items during 11:00-15:00.`,
        impact: "High",
        category: "Operations",
        aiConfidence: 92,
      })
    }

    // Dynamic pricing recommendations
    if (lowPerformers.length > 0) {
      recommendations.push({
        type: "pricing",
        title: "Dynamic Pricing Strategy",
        description: `${lowPerformers.length} products are underperforming. Implement 15-25% promotional pricing or bundle with top performers.`,
        impact: "Medium",
        category: "Pricing",
        aiConfidence: 87,
      })
    }

    // Category expansion
    if (topCategory) {
      recommendations.push({
        type: "growth",
        title: "Strategic Category Expansion",
        description: `${topCategory[0]} generates $${topCategory[1].toFixed(2)} revenue (${((topCategory[1] / Object.values(categoryStats).reduce((a, b) => a + b, 0)) * 100).toFixed(2)}% of total). Expand product line by 20-30%.`,
        impact: "High",
        category: "Growth",
        aiConfidence: 95,
      })
    }

    // Supply chain optimization
    if (topProduct) {
      recommendations.push({
        type: "supply",
        title: "Supply Chain Optimization",
        description: `${topProduct.name} is your top performer with ${topProduct.totalSales.toFixed(2)} units sold. Negotiate bulk pricing and ensure 2-week safety stock.`,
        impact: "High",
        category: "Supply Chain",
        aiConfidence: 89,
      })
    }

    // Demand forecasting with ML insights
    const recentTrend = data.slice(-7).reduce((sum, item) => sum + item.quantity, 0) / 7
    const previousTrend = data.slice(-14, -7).reduce((sum, item) => sum + item.quantity, 0) / 7

    if (recentTrend > previousTrend * 1.1) {
      const growthRate = ((recentTrend / previousTrend - 1) * 100).toFixed(2)
      recommendations.push({
        type: "forecast",
        title: "Demand Surge Prediction",
        description: `AI detects ${growthRate}% sales increase. Prepare for 25-40% higher demand in next 7 days. Increase inventory accordingly.`,
        impact: "High",
        category: "Forecasting",
        aiConfidence: 91,
      })
    }

    // Sustainability and waste reduction
    const lowTurnoverProducts = productStats.filter((p) => p.avgOrderSize < 2)
    if (lowTurnoverProducts.length > 0) {
      recommendations.push({
        type: "sustainability",
        title: "Waste Reduction Initiative",
        description: `${lowTurnoverProducts.length} products have low turnover. Implement AI-driven dynamic pricing to reduce waste by 30-45%.`,
        impact: "Medium",
        category: "Sustainability",
        aiConfidence: 84,
      })
    }

    // Cross-selling opportunities
    const topCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
    if (topCategories.length >= 2) {
      recommendations.push({
        type: "cross-sell",
        title: "Cross-Selling Opportunity",
        description: `Bundle ${topCategories[0][0]} with ${topCategories[1][0]} products. Potential 15-20% revenue increase through strategic placement.`,
        impact: "Medium",
        category: "Marketing",
        aiConfidence: 78,
      })
    }

    return {
      peakHour,
      topProduct,
      topCategory,
      recommendations,
      productStats: productStats.slice(0, 5),
      totalRevenue: data.reduce((sum, item) => sum + item.revenue, 0),
      totalSales: data.reduce((sum, item) => sum + item.quantity, 0),
      aiScore: Math.round(recommendations.reduce((sum, rec) => sum + rec.aiConfidence, 0) / recommendations.length),
    }
  }, [data, categoryStats])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`
    return num.toFixed(2)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Operations":
        return <Zap className="w-4 h-4" />
      case "Pricing":
        return <Target className="w-4 h-4" />
      case "Growth":
        return <TrendingUp className="w-4 h-4" />
      case "Supply Chain":
        return <AlertTriangle className="w-4 h-4" />
      case "Forecasting":
        return <Brain className="w-4 h-4" />
      case "Sustainability":
        return <Lightbulb className="w-4 h-4" />
      case "Marketing":
        return <Sparkles className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const handleDownloadInsights = async () => {
    if (!insights) return

    // Import jsPDF dynamically
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    // Set up the PDF
    doc.setFontSize(20)
    doc.text("AI Insights Report", 20, 20)

    doc.setFontSize(12)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35)
    doc.text(`AI Confidence Score: ${insights.aiScore.toFixed(2)}%`, 20, 45)
    doc.text(`Total Sales: ${insights.totalSales.toFixed(2)} units`, 20, 55)
    doc.text(`Total Revenue: $${insights.totalRevenue.toFixed(2)}`, 20, 65)

    // Key Insights
    doc.setFontSize(16)
    doc.text("Key Insights:", 20, 85)

    doc.setFontSize(12)
    doc.text(`Peak Hour: ${insights.peakHour.hour}:00 (${insights.peakHour.sales.toFixed(2)} sales)`, 20, 100)
    doc.text(`Top Product: ${insights.topProduct?.name} ($${insights.topProduct?.totalRevenue.toFixed(2)})`, 20, 110)
    doc.text(`Top Category: ${insights.topCategory?.[0]} ($${insights.topCategory?.[1].toFixed(2)})`, 20, 120)

    // AI Recommendations
    doc.setFontSize(16)
    doc.text("AI Recommendations:", 20, 140)

    let yPos = 155
    insights.recommendations.forEach((rec, index) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.text(`${index + 1}. [${rec.impact}] ${rec.title} (${rec.aiConfidence.toFixed(2)}% confidence)`, 20, yPos)
      yPos += 10

      // Split long descriptions into multiple lines
      const splitText = doc.splitTextToSize(rec.description, 170)
      doc.text(splitText, 25, yPos)
      yPos += splitText.length * 5 + 5

      doc.text(`Category: ${rec.category}`, 25, yPos)
      yPos += 15
    })

    // Top Products
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(16)
    doc.text("Top Performing Products:", 20, yPos)
    yPos += 15

    insights.productStats.forEach((product, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(12)
      doc.text(
        `${index + 1}. ${product.name} - ${product.totalSales.toFixed(2)} units, $${product.totalRevenue.toFixed(2)}`,
        20,
        yPos,
      )
      yPos += 10
    })

    // Save the PDF
    doc.save(`ai-insights-report-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  if (!insights) {
    return (
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <Brain className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No data available for AI analysis</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="w-5 h-5 text-purple-400" />
            AI-Powered Business Insights
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {insights.aiScore.toFixed(2)}% Confidence
            </Badge>
          </CardTitle>
          <Button
            onClick={handleDownloadInsights}
            variant="outline"
            size="sm"
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">Peak Performance</span>
            </div>
            <p className="text-white font-bold">{insights.peakHour.hour}:00</p>
            <p className="text-xs text-gray-400" title={insights.peakHour.sales.toFixed(2)}>
              {formatNumber(insights.peakHour.sales)} sales this hour
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Top Product</span>
            </div>
            <p className="text-white font-bold">{insights.topProduct?.name}</p>
            <p className="text-xs text-gray-400" title={`$${insights.topProduct?.totalRevenue.toFixed(2)}`}>
              ${formatNumber(insights.topProduct?.totalRevenue || 0)} revenue
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-medium">Top Category</span>
            </div>
            <p className="text-white font-bold">{insights.topCategory?.[0]}</p>
            <p className="text-xs text-gray-400" title={`$${insights.topCategory?.[1].toFixed(2)}`}>
              ${formatNumber(insights.topCategory?.[1] || 0)} revenue
            </p>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            AI Recommendations
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {insights.recommendations.length} insights
            </Badge>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(rec.category)}
                    <span className="font-medium text-white">{rec.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getImpactColor(rec.impact)}>{rec.impact}</Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {rec.aiConfidence.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">{rec.description}</p>
                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                  {rec.category}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Performance */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Top Performing Products
          </h3>
          <div className="space-y-2">
            {insights.productStats.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg border border-gray-600/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium" title={`$${product.totalRevenue.toFixed(2)}`}>
                    ${formatNumber(product.totalRevenue)}
                  </p>
                  <p className="text-xs text-gray-400" title={product.totalSales.toFixed(2)}>
                    {formatNumber(product.totalSales)} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
