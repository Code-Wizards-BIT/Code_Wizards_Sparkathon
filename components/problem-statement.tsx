import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, TrendingDown, DollarSign, Users } from "lucide-react"

export function ProblemStatement() {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Stockout Crisis",
      description: "Traditional forecasting leads to 30% stockout rates, causing customer frustration and lost sales",
      impact: "$1.1T lost annually",
    },
    {
      icon: TrendingDown,
      title: "Overstock Waste",
      description: "Poor demand prediction results in 25% overstock, tying up capital and increasing waste",
      impact: "$472B in excess inventory",
    },
    {
      icon: DollarSign,
      title: "Reactive Decisions",
      description: "Current systems rely on historical data only, missing real-time market signals",
      impact: "15-20% margin loss",
    },
    {
      icon: Users,
      title: "Customer Impact",
      description: "Poor inventory management directly affects customer satisfaction and loyalty",
      impact: "23% customer churn",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">The $1.5 Trillion Problem</h2>
          <p className="text-xl text-gray-600">
            Retail inventory management is broken. Traditional forecasting methods fail to capture the complexity of
            modern consumer behavior, leading to massive inefficiencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <Card key={index} className="border-2 hover:border-red-200 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <problem.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{problem.title}</h3>
                <p className="text-gray-600 mb-4">{problem.description}</p>
                <div className="text-lg font-bold text-red-600">{problem.impact}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
