import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Cpu, Cloud, Code } from "lucide-react"

export function TechnicalDetails() {
  const techStack = [
    {
      category: "Data Pipeline",
      icon: Database,
      technologies: ["Apache Airflow", "Apache Kafka", "Redis", "PostgreSQL"],
      description: "Real-time data ingestion and processing pipeline",
    },
    {
      category: "ML Framework",
      icon: Code,
      technologies: ["PyTorch", "Transformers", "scikit-learn", "NumPy"],
      description: "Advanced machine learning and AI model development",
    },
    {
      category: "API & Services",
      icon: Cpu,
      technologies: ["FastAPI", "Docker", "Kubernetes", "Prometheus"],
      description: "Scalable microservices architecture and monitoring",
    },
    {
      category: "Cloud Platform",
      icon: Cloud,
      technologies: ["AWS SageMaker", "S3", "EKS", "CloudWatch"],
      description: "Enterprise cloud infrastructure and deployment",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Technical Implementation</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">Technology Stack</h2>
            <p className="text-xl text-gray-600">
              Enterprise-grade technologies powering our AI-driven demand forecasting system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techStack.map((stack, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <stack.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold">{stack.category}</div>
                      <div className="text-sm text-gray-600 font-normal">{stack.description}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stack.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">System Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                    <div className="text-blue-800 font-medium">Transformer Layers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">16</div>
                    <div className="text-green-800 font-medium">Attention Heads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">512</div>
                    <div className="text-purple-800 font-medium">Hidden Dimensions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">{"<50ms"}</div>
                    <div className="text-orange-800 font-medium">Inference Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
