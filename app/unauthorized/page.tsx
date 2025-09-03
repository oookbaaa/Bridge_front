import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="font-heading text-3xl text-red-600 mb-4">Accès refusé</CardTitle>
            <p className="font-body text-lg text-slate-600">
              Vous n'avez pas les permissions requises pour accéder à cette page ou à cette ressource.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="font-heading font-semibold text-primary mb-3">Que pouvez-vous faire?</h3>
              <ul className="font-body text-slate-600 space-y-2 text-left">
                <li>• Vérifiez que vous êtes connecté avec le bon compte</li>
                <li>• Contactez un administrateur si vous pensez que c'est une erreur</li>
                <li>• Vérifiez si vous avez les permissions requises pour cette ressource</li>
                <li>• Essayez de vous déconnecter et de vous reconnecter</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="javascript:history.back()">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>

            <div className="border-t pt-6">
              <p className="font-body text-sm text-slate-500">
                Besoin d'aide? Contactez-nous à{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  info@ftb.tn
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
