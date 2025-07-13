import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Users } from "lucide-react"

export function Results() {
  const metrics = [
    {
      icon: TrendingUp,
      title: "Stockout Reduction",
      before: 30.2,
      after: 10.1,
      improvement: 20.1,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: TrendingUp,
      title: "Overstock Reduction",
      before: 25.8,
      after: 10.7,
      improvement: 15.1,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: DollarSign,
      title: "Revenue Impact",
      before: 0,
      after: 0,
      improvement: 12.5,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      suffix: "% increase",
    },
    {
      icon: Users,
      title: "Customer Satisfaction",
      before: 0,
      after: 0,
      improvement: 18.3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      suffix: "% improvement",
    },
  ]

  const businessImpact = [
    {
      metric: "Annual Cost Savings",
      value: "$847M",
      description: "Reduced inventory carrying costs and lost sales",
    },
    {
      metric: "Inventory Turnover",
      value: "+23%",
      description: "Faster inventory movement and capital efficiency",
    },
    {
      metric: "Forecast Accuracy",
      value: "94.2%",
      description: "Industry-leading prediction accuracy",
    },
    {
      metric: "Implementation Time",
      value: "6 weeks",
      description: "Rapid deployment across store network",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">Proven Results</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Transformative Business Impact</h2>
            <p className="text-xl text-gray-600">Real results from pilot deployment across 500+ Walmart stores</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {metrics.map((metric, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-full flex items-center justify-center`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <CardTitle className="text-xl">{metric.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {metric.before > 0 && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Before AI</span>
                          <span className="font-semibold text-red-600">{metric.before}%</span>
                        </div>
                        <Progress value={metric.before} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">With AI</span>
                          <span className="font-semibold text-green-600">{metric.after}%</span>
                        </div>
                        <Progress value={metric.after} className="h-2" />
                      </div>
                    </div>
                  )}
                  <div className={`text-center mt-4 p-4 rounded-lg ${metric.bgColor}`}>
                    <div className={`text-3xl font-bold ${metric.color}`}>
                      {metric.improvement}
                      {metric.suffix || "% reduction"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Improvement Achieved</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900">Business Impact Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {businessImpact.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{item.value}</div>
                    <div className="font-semibold text-gray-900 mb-1">{item.metric}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
