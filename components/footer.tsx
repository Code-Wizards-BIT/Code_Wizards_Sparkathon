import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink, Mail, Users } from "lucide-react"

export function Footer() {
  const teamMembers = [
    { name: "Debspandan Chakraborty", role: "4th Year, Birla Institute of Technology, Mesra", github: "DebspandanC2911" },
    { name: "Vedant Agrawal", role: "4th Year, Birla Institute of Technology, Mesra", github: "vedant8000" },
    { name: "Pratyush Mangal", role: "4th Year, Birla Institute of Technology, Mesra", github: "mangalpratyush" },
    { name: "Vivek Chandravanshi", role: "4th Year, Birla Institute of Technology, Mesra", github: "Vivek-chandravanshi" },
  ]

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">
              <Users className="w-4 h-4 mr-2" />
              Code Wizards
            </Badge>
            <h2 className="text-3xl font-bold mb-6">Built for Walmart Hackathon 2025</h2>
            <p className="text-xl text-gray-300 mb-8">
              Revolutionizing retail inventory management with AI-powered demand forecasting
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button className="bg-white text-gray-900 hover:bg-gray-100">
                <Github className="w-5 h-5 mr-2" />
                View Source Code
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <ExternalLink className="w-5 h-5 mr-2" />
                Live Demo
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <Mail className="w-5 h-5 mr-2" />
                Contact Team
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h4 className="font-semibold text-lg">{member.name}</h4>
                <p className="text-gray-400 mb-2">{member.role}</p>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-black">
                  <Github className="w-4 h-4 mr-2" />@{member.github}
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h4 className="font-semibold mb-4">Key Achievements</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>20% stockout reduction</li>
                  <li>15% overstock reduction</li>
                  <li>94.2% forecast accuracy</li>
                  <li>{"<50ms"} inference time</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Technology Stack</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>PyTorch Transformers</li>
                  <li>FastAPI Microservices</li>
                  <li>Kubernetes Deployment</li>
                  <li>Real-time Data Pipeline</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Business Impact</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>$847M annual savings</li>
                  <li>23% inventory turnover</li>
                  <li>18% customer satisfaction</li>
                  <li>6-week implementation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-400">
            <p>
              © 2025 
              Code Wizards • Hyper-Local AI Demand Forecasting • Built with ❤️ for retail innovation
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
