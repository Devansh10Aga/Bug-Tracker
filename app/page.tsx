import { Button } from "@/components/ui/button"
import { BugIcon, CheckCircleIcon, ClockIcon, LineChartIcon } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'

export default function Component() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-blue-600">BugTracker Pro</span>
                <span className="block">Streamline Your Projects</span>
              </h1>
              <p className="mt-4 max-w-xl text-xl text-gray-500">
                Efficiently manage tasks, track bugs, and boost team productivity with our comprehensive project management solution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { icon: CheckCircleIcon, text: "Intuitive Task Management" },
                { icon: BugIcon, text: "Efficient Bug Tracking" },
                { icon: ClockIcon, text: "Built-in Time Tracking" },
                { icon: LineChartIcon, text: "Insightful Analytics" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <Image
                  className="rounded-lg shadow-2xl"
                  src="/dashboard.png"
                  alt="BugTracker Pro Dashboard"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}