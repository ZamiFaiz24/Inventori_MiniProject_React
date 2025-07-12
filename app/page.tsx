// app/page.tsx (Ini adalah halaman utama baru, tampilan marketplace)
"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { api, type Product } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Package } from "lucide-react" // Import icon Package

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await api.getProducts()
      setProducts(data)
    } catch (err) {
      console.error("Gagal memuat produk:", err)
      setError("Gagal memuat produk dari server.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-lg">Memuat produk...</div>
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500 text-lg">{error}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Katalog Aki Mainan</h1>
        <div className="flex gap-2">
          <Link href="/products/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk Baru
            </Button>
          </Link>
          <Link href="/inventory">
            {" "}
            {/* Tombol untuk ke halaman manajemen stok */}
            <Button variant="outline">
              <Package className="mr-2 h-4 w-4" /> Kelola Inventaris
            </Button>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Tidak ada produk dalam katalog. Silakan tambahkan yang baru.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
