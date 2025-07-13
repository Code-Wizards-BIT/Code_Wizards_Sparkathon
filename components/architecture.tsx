import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Database, Cpu, Cloud, Zap } from "lucide-react"

export function Architecture() {
  const architectureSteps = [
    {
      icon: Database,
      title: "Data Ingestion",
      description: "Multi-source data pipeline",
      details: ["POS transactions", "Social media APIs", "Weather services", "Real-time streaming"],
    },
    {
      icon: Cpu,
      title: "Feature Engineering",
      description: "Advanced preprocessing",
      details: ["Time series alignment", "Sentiment analysis", "Weather normalization", "Rolling windows"],
    },
    {
      icon: Zap,
      title: "Transformer Model",
      description: "AI prediction engine",
      details: ["Multi-head attention", "Cross-modal fusion", "Sequence-to-sequence", "Quantile regression"],
    },
    {
      icon: Cloud,
      title: "Deployment",
      description: "Scalable microservice",
      details: ["FastAPI service", "Kubernetes cluster", "Auto-scaling", "Real-time inference"],
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">Technical Architecture</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">End-to-End AI Pipeline</h2>
            <p className="text-xl text-blue-100">
              Scalable, production-ready architecture designed for enterprise deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {architectureSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-white/10 border-white/20 text-white h-full">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <p className="text-blue-200">{step.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center text-sm text-blue-100">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {index < architectureSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Model Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300 mb-2">12</div>
                  <div className="text-blue-100">Transformer Layers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300 mb-2">16</div>
                  <div className="text-blue-100">Attention Heads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300 mb-2">512</div>
                  <div className="text-blue-100">Hidden Dimensions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300 mb-2">{"<50ms"}</div>
                  <div className="text-blue-100">Inference Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
