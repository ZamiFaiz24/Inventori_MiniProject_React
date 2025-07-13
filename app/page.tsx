// app/page.tsx (Ini adalah halaman utama baru, tampilan marketplace)
"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { api, type Product } from "@/lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Package } from "lucide-react"

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
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-muted-foreground">
        Memuat produk...
      </div>
    )
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500 text-lg">{error}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900">Katalog Aki Mainan</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/products/new">
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk Baru
            </Button>
          </Link>
          <Link href="/inventory">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Package className="mr-2 h-4 w-4" /> Kelola Inventaris
            </Button>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center text-muted-foreground">
          <Package className="h-16 w-16 mb-4 text-gray-400" />
          <p className="text-xl font-medium">Tidak ada produk dalam katalog.</p>
          <p className="text-md">Silakan tambahkan produk baru untuk ditampilkan di sini.</p>
          <Link href="/products/new" className="mt-6">
            <Button>Tambah Produk Pertama</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
