import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <CardTitle className="font-heading text-3xl text-primary mb-4">Page Not Found</CardTitle>
            <p className="font-body text-lg text-slate-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-heading font-semibold text-primary mb-3">What can you do?</h3>
              <ul className="font-body text-slate-600 space-y-2 text-left">
                <li>• Check the URL for any typos</li>
                <li>• Use the navigation menu to find what you're looking for</li>
                <li>• Visit our homepage to start fresh</li>
                <li>• Contact us if you believe this is an error</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="javascript:history.back()">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>

            <div className="border-t pt-6">
              <p className="font-body text-sm text-slate-500">
                Need help? Contact us at{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  info@tbf.tn
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
