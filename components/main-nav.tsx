// components/main-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Package, Store, PlusCircle } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b bg-background shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Store className="h-6 w-6" />
          <span>Aki Mainan Store</span>
        </Link>
        <div className="hidden md:flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" className={cn("text-base", pathname === "/" && "bg-muted text-primary")}>
              <Store className="mr-2 h-4 w-4" /> Katalog
            </Button>
          </Link>
          <Link href="/inventory">
            <Button variant="ghost" className={cn("text-base", pathname === "/inventory" && "bg-muted text-primary")}>
              <Package className="mr-2 h-4 w-4" /> Manajemen Inventaris
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Link href="/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </Link>
      </div>
    </nav>
  )
}
