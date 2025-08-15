"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings, Trophy } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { RoleGuard } from "@/components/role-guard"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Rankings", href: "/rankings" },
    { name: "Events", href: "/events" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <img src="/logo.png" alt="Tunisian Bridge Federation" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-bold text-xl text-primary">Tunisian Bridge Federation</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-body text-slate-600 hover:text-primary transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-body font-semibold">{user.name}</p>
                    <p className="font-body text-sm text-slate-600">{user.email}</p>
                    {/* Added role guard for admin badge */}
                    <RoleGuard allowedRoles={["admin"]}>
                      <p className="font-body text-xs text-accent font-semibold">Administrator</p>
                    </RoleGuard>
                  </div>
                  <DropdownMenuSeparator />
                  {/* Added role-based menu items */}
                  <RoleGuard allowedRoles={["admin"]}>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  </RoleGuard>
                  <RoleGuard allowedRoles={["player"]}>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </RoleGuard>
                  {user.points && (
                    <DropdownMenuItem asChild>
                      <Link href="/rankings" className="flex items-center">
                        <Trophy className="h-4 w-4 mr-2" />
                        My Ranking ({user.points} pts)
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
                  <Link href="/register">Join Us</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-body text-slate-600 hover:text-primary block px-3 py-2 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t pt-4">
                {user ? (
                  <div className="px-3 space-y-2">
                    <div className="py-2">
                      <p className="font-body font-semibold">{user.name}</p>
                      <p className="font-body text-sm text-slate-600">{user.email}</p>
                    </div>
                    {/* Added role-based mobile menu items */}
                    <RoleGuard allowedRoles={["admin"]}>
                      <Link
                        href="/admin"
                        className="font-body text-slate-600 hover:text-primary block py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    </RoleGuard>
                    <RoleGuard allowedRoles={["player"]}>
                      <Link
                        href="/dashboard"
                        className="font-body text-slate-600 hover:text-primary block py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Dashboard
                      </Link>
                    </RoleGuard>
                    <button
                      onClick={handleLogout}
                      className="font-body text-red-600 hover:text-red-700 block py-2 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 px-3">
                    <Button variant="outline" size="sm" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/register">Join Us</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
