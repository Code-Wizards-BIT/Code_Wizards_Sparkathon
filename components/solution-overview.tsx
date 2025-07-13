import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, MessageSquare, Cloud, Brain, Zap, Target } from "lucide-react"

export function SolutionOverview() {
  const dataSources = [
    {
      icon: Database,
      title: "POS Data",
      description: "Real-time sales data per SKU×store with hourly granularity",
      features: ["Historical sales patterns", "Seasonal trends", "Store-specific behavior"],
    },
    {
      icon: MessageSquare,
      title: "Social Sentiment",
      description: "Twitter/Reddit buzz metrics and sentiment analysis per region",
      features: ["Brand mentions", "Product sentiment", "Viral trend detection"],
    },
    {
      icon: Cloud,
      title: "Weather Data",
      description: "Temperature, precipitation, and holiday flags per location",
      features: ["Weather impact modeling", "Seasonal adjustments", "Event-driven demand"],
    },
  ]

  const aiFeatures = [
    {
      icon: Brain,
      title: "Transformer Architecture",
      description: "Advanced sequence-to-sequence model with cross-attention mechanisms",
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Sub-second inference with continuous learning capabilities",
    },
    {
      icon: Target,
      title: "Hyper-local Precision",
      description: "Store-level predictions with 95% accuracy confidence intervals",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800">Our Solution</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">AI-Powered Demand Intelligence</h2>
          <p className="text-xl text-gray-600">
            Our revolutionary system combines multiple data streams through advanced transformer models to predict
            demand with unprecedented accuracy.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Data Fusion Pipeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataSources.map((source, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <source.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{source.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{source.description}</p>
                  <ul className="space-y-2">
                    {source.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">AI Engine Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-green-200 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
